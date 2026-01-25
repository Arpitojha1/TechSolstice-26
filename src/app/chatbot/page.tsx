import Chat from '@/components/chat/Chat';

import { memo } from 'react';
const HomePage = () => {
  return (
    <main>
      <Chat />
    </main>
  );
}

export default memo(HomePage);