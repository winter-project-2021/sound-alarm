import Card from './components/Card';
import Modal from './components/Modal';
import SensitivityModal from './components/SensitivityModal';
import './style/App.scss';

function App() {

    return (
      <div className='App'>
          <Card/>
          <Modal/>
          <SensitivityModal/>
      </div>
    );
}

export default App;
