import { useSelector } from 'react-redux';
import trans from './lang';
import '../style/Guide.scss';

function Guide() {


  const { lang } = useSelector(state => state.preferenceReducer);


    return (
      <div className='Guide'>
          {trans[lang]['guide'][0]}
          <div className='Text'>
            {trans[lang]['guide'][1]}
            <div className='TextGuide'>
              {trans[lang]['guide'][2]}
              <br/>
              {trans[lang]['guide'][3]}
            </div>
          </div>
          
          <div className='Sound'>
            {trans[lang]['guide'][4]}
            <div className='SoundGuide'>
            {trans[lang]['guide'][5]}
            <br/>
            {trans[lang]['guide'][6]}
            <br/>
            {trans[lang]['guide'][7]}
            <br/>
            {trans[lang]['guide'][8]}
            <br/>
            {trans[lang]['guide'][9]}
            <br/>
            {trans[lang]['guide'][10]}
            <br/>
            {trans[lang]['guide'][11]}
            <br/>
            {trans[lang]['guide'][12]}
            <br/>
            {trans[lang]['guide'][13]}
            <br/>
            {trans[lang]['guide'][14]}
            <br/>
            {trans[lang]['guide'][15]}
            <br/>
            {trans[lang]['guide'][16]}
            </div>
            
          </div>
      </div>
    );
}

export default Guide;