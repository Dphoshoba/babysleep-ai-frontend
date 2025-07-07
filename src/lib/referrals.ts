import { v4 as uuidv4 } from 'uuid';
import { supabase } from './supabaseClient';

// Function to generate a unique referral code for a user
export const generateReferralCode = async (uid: string): Promise<string> => {
  const referralCode = uuidv4().substring(0, 8).toUpperCase(); // Generate a random 8-character code
  return referralCode;
};

// Function to handle referral signup
export const handleReferralSignup = async (referrerCode: string, newUserUid: string): Promise<void> => {
  try {
    // Find the referrer's UID based on the referral code
    const { data: referrerData, error: referrerError } = await supabase
      .from('users')
      .select('id')
      .eq('referral_code', referrerCode)
      .single();

    if (referrerError) {
      console.error('Error finding referrer:', referrerError);
      return;
    }

    if (!referrerData) {
      console.log('No referrer found with code:', referrerCode);
      return;
    }

    const referrerUid = referrerData.id;

    // Create a referral record in the database
    const { error: referralCreateError } = await supabase
      .from('referrals')
      .insert([
        { referrer_uid: referrerUid, referred_uid: newUserUid }
      ]);

    if (referralCreateError) {
      console.error('Error creating referral:', referralCreateError);
      return;
    }

    // Check and unlock rewards for the referrer
    await checkAndUnlockRewards(referrerUid);

  } catch (error) {
    console.error('Error handling referral signup:', error);
  }
};

// Function to check and unlock rewards for a user
export const checkAndUnlockRewards = async (uid: string): Promise<void> => {
  try {
    // Count the number of referrals for the user
    const { count, error: referralCountError } = await supabase
      .from('referrals')
      .select('*', { count: 'exact' })
      .eq('referrer_uid', uid);

    if (referralCountError) {
      console.error('Error counting referrals:', referralCountError);
      return;
    }

    const referralCount = count || 0;

    // Determine the rewards based on the referral count
    let rewards = [];
    if (referralCount >= 1) rewards.push('7_days_premium');
    if (referralCount >= 3) rewards.push('30_days_premium');
    if (referralCount >= 5) rewards.push('lifetime_sleep_sounds');
    if (referralCount >= 10) rewards.push('3_months_premium_custom_badge');
    if (referralCount >= 20) rewards.push('lifetime_premium');

    // Update the user's rewards in the database
    if (rewards.length > 0) {
      const { error: updateError } = await supabase
        .from('users')
        .update({ rewards: rewards })
        .eq('id', uid);

      if (updateError) {
        console.error('Error updating rewards:', updateError);
      }
    }
  } catch (error) {
    console.error('Error checking and unlocking rewards:', error);
  }
};