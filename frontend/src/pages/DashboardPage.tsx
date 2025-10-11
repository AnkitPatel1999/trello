import Header from '../components/header/Header';
import Board from '../components/board/Board';
import LeftSidebar from '../components/leftsidebar/LeftSidebar';

const DashboardPage = () => {
  console.log('DashboardPage rendering');

  return (
    <div className='app-container'>
      <div className='ae-d-flex'>
        <div className='left-sidebar-component'>
          <LeftSidebar />
        </div>
        <div className='right-sidebar-component'>
          <Header />
          <div className='board-component'>
            <Board />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
