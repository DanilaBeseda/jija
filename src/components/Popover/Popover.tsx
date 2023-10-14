import "./Popover.css";
import { IAtm, IBank } from "../../App.tsx";
//import "../../../public/ATM-photo.jpg"
interface IPopoverProps {
  atm: IAtm | null;
  bank: IBank | null;
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
