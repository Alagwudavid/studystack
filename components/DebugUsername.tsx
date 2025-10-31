'use client';

type Props = { username: string };

export default function DebugUsername({ username }: Props) {
  console.log('DebugUsername component received username:', username);

  return (
    <div className="p-4 bg-yellow-100 border border-yellow-300 rounded">
      <h3 className="font-bold">Debug Info:</h3>
      <p>Username prop: "{username}"</p>
      <p>Type: {typeof username}</p>
      <p>Length: {username?.length || 'undefined'}</p>
    </div>
  );
}