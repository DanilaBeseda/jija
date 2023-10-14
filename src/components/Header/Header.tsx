import './Header.css'

interface iCoordsProps {
    long: number,
    lat: number
}

const Header = ({long, lat}:iCoordsProps) => {
    return (
        <div className={'mainHeader'}>
            <div className={'logoBlock'}><img src={'../../../public/VTB_logo-white_ru_rgb.svg'} className={'Logo'}/></div>
            <div className={"probel"}/>
            <div className={"mainCoords"}>Latitude: {lat};<br/> Longitude: {long}</div>
        </div>
        )
}

export default Header;