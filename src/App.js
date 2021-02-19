import Card from './components/Card';
import Loading from './components/Loading';
import Modal from './components/Modal';
import SensitivityModal from './components/SensitivityModal';
import './style/App.scss';

function App() {

    return (
      <div className='App'>
          <Card/>
          <Modal/>
          <SensitivityModal/>
          <Loading/>
      </div>
    );
}

export default App;
