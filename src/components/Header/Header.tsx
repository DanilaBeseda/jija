import "./Header.css";

interface iCoordsProps {
  coords: [number, number];
}

const Header = ({ coords }: iCoordsProps) => {
  return (
    <div className={"mainHeader"}>
      <div className={"logoBlock"}>
        <img
          src={"../../../public/VTB_logo-white_ru_rgb.svg"}
          className={"Logo"}
        />
      </div>
      <div className={"probel"} />
      <div className={"mainCoords"}>
        Latitude: {coords[0]};<br /> Longitude: {coords[1]}
      </div>
    </div>
  );
};

export default Header;
