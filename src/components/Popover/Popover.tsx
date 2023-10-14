import { IAtm, IOffice } from "../../types";
import "./Popover.css";
import { Tooltip } from "@mui/material";

interface IPopoverProps {
  atm: IAtm | null;
  office: IOffice | null;
}
export const Popover = ({ atm, office }: IPopoverProps) => {
  return (
    <div className="popover">
      <div className={"blockPhoto"}>
        {atm && <img src={"public/ATM-photo.jpg"} className={"photo"} />}
        {office && <img src={"public/Dep.jpg"} className={"photo"} />}
      </div>
      <div className={"blockInfo"}>
        <div className={"nameStr"}>
          <div>{office && <span>Название:</span>}</div>
          <div>
            <span>Адрес:</span>
          </div>
          <div>{office && <span>Статус:</span>}</div>
          <div>{office && <span>Часы работы:</span>}</div>
          <div>{office && <span>Расчетно кассовые операции:</span>}</div>
          <div>{office && <span>Часы работы для юр лиц:</span>}</div>
          <div>{office && <span>Тип офиса:</span>}</div>
          <div>{office && <span>Формат ТП:</span>}</div>
          <div>{office && <span>Наличие управления очередью:</span>}</div>
          <div>{office && <span>Наличие пандусов:</span>}</div>
          <div>
            <span>Координаты:</span>
          </div>
          <div>{office && <span>Ближайшая станция метро:</span>}</div>
          <div>{office && <span>Выдача КЭП:</span>}</div>
          <div>{atm && <span>Весь день:</span>}</div>
        </div>
        <div className={"valueStr"}>
          <div>{office && <span>{office.salePointName}</span>}</div>
          <div>
            <span>{(office && office.address) || (atm && atm.address)}</span>
          </div>
          <div>{office && <span>{office.status}</span>}</div>
          <div>{office && <span>Часы работы</span>}</div>
          <div>{office && <span>{office.rko}</span>}</div>
          <div>{office && <span>Часы работы для юр лиц:</span>}</div>
          <div>{office && <span>{office.officeType}</span>}</div>
          <div>{office && <span>{office.salePointFormat}</span>}</div>
          <div>{office && <span>{office.suoAvailability}</span>}</div>
          <div>{office && <span>{office.hasRamp}</span>}</div>

          <Tooltip title="Копировать">
            <div
              onClick={() => navigator.clipboard.writeText("Координаты")}
              className={"copyBlock"}
            >
              <span>
                {office?.latitude}, {office?.longitude}
              </span>
            </div>
          </Tooltip>

          <div>{office && <span>{office.metroStation}</span>}</div>
          <div>{office && <span>{office.kep}</span>}</div>
          <div>{atm && <span>{atm.allDay}</span>}</div>
        </div>
      </div>
    </div>
  );
};
