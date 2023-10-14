import {IAtm, IOffice} from "../../types";
import "./Popover.css";
import { Tooltip } from "@mui/material";
import { Bar } from 'react-chartjs-2';

interface IPopoverProps {
  atm: IAtm | null;
  office: IOffice | null;
}

interface IBarProps {
  load: {days: number, loads: number[][]}[]
}

interface IWorkHoursProps {
  data: {days: string, hours: string}[]
}


const BarChart = ({load}: IBarProps) => {
  // @ts-ignore
  const labels = load[0].loads.map((hour => hour[0]));

  // @ts-ignore
  const data = {
    labels,
    datasets: [
      {
        label: 'load',
        data: load[0].loads.map((hour => hour[1])),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };
  const options = {
    responsive: true,
  };
  return <Bar options={options} data={data} id = "chart"/>
}

const WorkFours = ({data}:IWorkHoursProps) => {
  return <div className={'popoverWorkHoursDiv'}>
    <p className={'text'}>
      Режим Работы:
    </p>
    {
      data.map((day =>
        <p className={'text popoverWorkHoursLabel'} key={day.days}>
        {`${day.days}: ${day.hours}`}
        </p>
      ))
    }
  </div>
}

export const Popover = ({ office, atm }: IPopoverProps) => {
  return (
    <div className="popover">
      <p className={'popoverName'}>{office?.salePointName}</p>
      <img src={"public/Dep.jpg"} className={"photo"}  alt=''/>
      <p className={'popoverAddress'}>{`${office?.address}(${office?.metroStation})`}</p>
      <div className={'divider'}/>
      {office?.openHoursIndividual && <WorkFours data={office.openHoursIndividual}/>}
      {office?.load && <BarChart load={office?.load}/>}
      <div className={'divider'}/>
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
