import Image from 'next/image';

export default function Header() {
  return (
    <header className="ucul-header">
      <h1>
        <Image src="/img/logo.png" alt="eLife" width={40} height={45} className="inline mr-2" />
        Auto Detection System
      </h1>
    </header>
  );
}
