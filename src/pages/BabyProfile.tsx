import { useParams } from 'react-router-dom';

export default function BabyProfile() {
  const { babyId } = useParams();
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">👶 Baby Profile</h2>
      <p>View or edit individual baby details here.</p>
      {babyId && <div className="mt-2 text-gray-600">Baby ID: {babyId}</div>}
    </div>
  );
}
