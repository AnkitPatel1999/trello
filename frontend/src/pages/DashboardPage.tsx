import { useState, useCallback } from 'react';
import Header from '../components/header/Header';
import Board from '../components/board/Board';
import LeftSidebar from '../components/leftsidebar/LeftSidebar';

const DashboardPage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleProjectCreated = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  return (
    <div className='app-container'>
      <div className='ae-d-flex'>
        <div className='left-sidebar-component'>
          <LeftSidebar refreshTrigger={refreshTrigger} />
        </div>
        <div className='right-sidebar-component'>
          <Header onProjectCreated={handleProjectCreated} />
          <div className='board-component'>
            <Board />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
