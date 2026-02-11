import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ padding: '40px', textAlign: 'center', color: 'white' }}>
      <h1 style={{ fontSize: '72px' }}>404</h1>
      <p style={{ fontSize: '20px' }}>Page not found</p>
      <Link href="/" style={{ color: 'white', marginTop: '20px', display: 'inline-block' }}>
        Go Home
      </Link>
    </div>
  );
}
