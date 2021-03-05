import Card from './components/Card';
import Loading from './components/Loading';
import Modal from './components/Modal';
import SensitivityModal from './components/SensitivityModal';
import DetectingModal from './components/DetectingModal';
import './style/App.scss';

function App() {

    return (
      <div className='App'>
          <Card/>
          <SensitivityModal/>
          <DetectingModal/>
          <Loading/>
          <Modal/>
      </div>
    );
}

export default App;
