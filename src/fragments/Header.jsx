import { borrarSesion } from '../utils/SessionUtil';
import { useNavigate } from 'react-router-dom';
import '../css/Header_Style.css';
import 'boxicons';


const Header = () => {
  const navegation = useNavigate();

  const handleClick = () => {
    borrarSesion();
    navegation('/login');
  }
  return (


    <header className='header'>
      <input type="checkbox" id='check' />
      <label htmlFor="check" className='icons'>
        <i className='bx bx-menu' id='menu-icon'></i>
        <i className='bx bx-x' id='close-icon'></i>
      </label>
      <nav className='navbar'>
        <a href="/principal" >Home</a>
        <a href="/login">Login</a>
        <a href="/sobreapi">Sobre el API</a>
        <a href="/contactos">Contactos</a>
      </nav>

    </header>
  )
}

export default Header;