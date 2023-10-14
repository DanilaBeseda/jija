import {IAtm, IOffice} from "../../types";
import "./Popover.css";
import { Tooltip } from "@mui/material";
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Legend,
} from 'chart.js';
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Legend
);
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import {useState} from "react";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import cn from 'classnames'


interface IPopoverProps {
  atm: IAtm | null;
  office: IOffice | null;
}

interface IBarProps {
  title: string
  load: {days: number, loads: number[][]}[]
}

interface IWorkHoursProps {
  title: string
  data: {days: string, hours: string}[]
}

interface IUserTypeButtonProps {
  individual: boolean,
  setIndividual: (individual: boolean) => void
}

const UserTypeButton = ({individual, setIndividual}: IUserTypeButtonProps  ) => {
  return (<div className={'userTypeContainer'}>
    <div className={cn('userTypeButton', individual && 'userTypeButtonActive')} onClick={() => {
      setIndividual(true)
    }}>
      Для физ. лиц
    </div>
    <div className={cn('userTypeButton', !individual && 'userTypeButtonActive')} onClick={() => {
      setIndividual(false)
    }}>
      Для юр. лиц
    </div>
  </div>)
}

const BarChart = ({title, load}: IBarProps) => {
  console.log(load)
  // @ts-ignore
  const labels = load[0].loads.map((hour => hour[0]));

  // @ts-ignore
  const data = {
    labels,
    datasets: [
      {
        label: title,
        data: load[0].loads.map((hour => hour[1])),
        backgroundColor: 'red',
      },
    ],
  };

  return <Bar data={data} id = "chart"/>
}

const WorkFours = ({title, data}:IWorkHoursProps) => {
  const [open, setOpen] = useState(false)
  return <div className={'popoverWorkHoursDiv'} onClick={() => {setOpen(!open)}}>
    <div className={'text popoverWorkHoursTitle'}>
      {title}
      {open ? <ExpandLessIcon/> : <ExpandMoreIcon/>}
    </div>
    {open &&
      data.map((day =>
        <p className={'text popoverWorkHoursLabel'} key={day.days} onClick={e => e.stopPropagation()}>
        {`${day.days}: ${day.hours}`}
        </p>
      ))
    }
  </div>
}

const OfficeService = () => {
  return <p className={'text'}>
    открытие и закрытие счетов, переводы денежных средств, выдачу кредитов и займов, пополнение депозитов, обмен валюты, выпуск и использование банковских карт, платежи через интернет-банкинг и многое другое.
  </p>
}

const ATMService = () => {
  return <p className={'text'}>
    снять наличные с банковской карты
    оплатить мобильный телефон,
    запросить баланс или выписку по последним операциям,
    перевести средства с карты на карту.
  </p>
}

export const PopoverOffice =  ({office}: { office: IOffice }) => {
  const [individual, setIndividual] = useState(true)
  return(
      <div className="popover">
        <SimpleBar style={{ maxHeight: '100%' }}>
        <p className={'popoverName'}>{office?.salePointName}</p>
        <img src={"public/Dep.jpg"} className={"photo"}  alt=''/>
        <p className={'popoverAddress'}>{`${office?.address} (${office?.metroStation})`}</p>
        <div className={'divider'}/>
          { office.openHours[0].days !== 'Не обслуживает ЮЛ' && <UserTypeButton individual={individual} setIndividual={setIndividual} />}
          {individual ?
              office?.openHoursIndividual && <WorkFours title={'Режим работы для физ. лиц'} data={office.openHoursIndividual}/>
          : office?.openHours && <WorkFours title={'Режим работы для юр. лиц'} data={office.openHours}/>
          }
          {individual ?
              office?.load && <BarChart title={'Загруженность отделения для юр. лиц'} load={office?.load}/>
             : office?.load && <BarChart title={'Загруженность отделения для юр. лиц'} load={office?.load}/>
          }
        {}
        <div className={'divider'}/>
        <OfficeService/>
        </SimpleBar>
      </div>
  )
}

export const PopoverATM = ({atm}: { atm: IAtm }) => {
  return(
      <div className="popover">
        <SimpleBar style={{ maxHeight: '100%' }}>
          <p className={'popoverName'}>Банкомат</p>
          <img src={"public/ATM-photo.jpg"} className={"photo"}  alt=''/>
          <p className={'popoverAddress'}>{atm?.address}</p>
          <div className={'divider'}/>
             {atm?.load && <BarChart title = 'Загруженность банкомата' load={atm?.load}/>}
          <div className={'divider'}/>
          <OfficeService/>
        </SimpleBar>
      </div>
  )
}

export const Popover = ({ office, atm }: IPopoverProps) => {
  if (office) return (<PopoverOffice office={office}/>)
  if (atm) return (<PopoverATM atm={atm}/>)
  return null
  return (
    <div className="popover">
      <p className={'popoverName'}>{office?.salePointName}</p>
      <img src={"public/Dep.jpg"} className={"photo"}  alt=''/>
      <p className={'popoverAddress'}>{`${office?.address}(${office?.metroStation})`}</p>
      <div className={'divider'}/>
      {office?.openHoursIndividual && <WorkFours data={office.openHoursIndividual}/>}
      {office?.load && <BarChart load={office?.load}/>}
      <div className={'divider'}/>
      <OfficeService/>
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
