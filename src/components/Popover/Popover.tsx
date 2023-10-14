import { IAtm, IOffice } from "../../types";
import "./Popover.css";
//import "../../../public/ATM-photo.jpg"
interface IPopoverProps {
  atm: IAtm | null;
  bank: IOffice | null;
}
export const Popover = ({ atm, bank }: IPopoverProps) => {
  return (
    <div className="popover">
      <div className={"blockPhoto"}>
        {atm && <img src={"public/ATM-photo.jpg"} className={"photo"} />}
        {bank && <img src={"public/Dep.jpg"} className={"photo"} />}
      </div>
    </div>
  );
};
