import {IAtm, IOffice, ITime} from "../../types";
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
import React, {useEffect, useState} from "react";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import cn from 'classnames'
import {atmIndividualService, atmService, officeIndividualService, officeService} from "../../config.ts";
import { TalonchikModal } from "./Talonchik.tsx";


interface IPopoverProps {
  atm: IAtm | null;
  office: IOffice | null;
  time: ITime | null
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
  if (!load[0]) return null
  // @ts-ignore
  const labels = load[0].loads.map((hour => hour[0]));

  // @ts-ignore
  const data = {
    labels,
    datasets: [
      {
        label: title,
        data: load[0].loads.map((hour => hour[1])),
        backgroundColor: '#cecece',
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

const ServiceList = ({data}: {data: string[]}) => {
  return (<div className={'serviceList'}>
    <p className={'text'}> Предоставляемые услуги </p>
        {data.map((s) => <p className={'serviceLabel'}>
          {`  -  ${s}`}
        </p>)}
      </div>)
}

function msecToString(val: number) {
  var mins = Math.round(val / 60000);
  const hours = Math.floor(mins / 60);
  mins %= 60;
  if (mins < 10)
    mins = '0' + mins;
  return hours + 'ч. ' + mins + 'мин.';
}


export const PopoverOffice =  ({office, time }: { office: IOffice, time: ITime | null  }) => {
  const [individual, setIndividual] = useState(true)
  const [openModal, setOpenModal] = useState(false)
  const [number, setNumber] = useState<undefined | number>(undefined)
  const [now, setNow] = useState<null | string>(null)

  useEffect(() => {
    const now = new Date()
    setNow(`${now.getHours()}:${now.getMinutes()}`)
  }, [number])

  useEffect(() => {
    setNumber(undefined)
  }, [office])

  const setOpen = (open: boolean) => {
    setOpenModal(open)
  }

  return(
      <div className="popover">
        <SimpleBar style={{ maxHeight: '100%' }}>
        <p className={'popoverName'}>{office?.salePointName}</p>
        <img src={"public/Dep.jpg"} className={"photo"}  alt=''/>
          {
            office.metroStation ? <p className={'popoverAddress'}>{`${office?.address} (${office?.metroStation})`}</p>
                :
                <p className={'popoverAddress'}>{`${office?.address}`}</p>
          }
          {time?.travelTime && <div className={'timeLine'}>
            Время в пути: {msecToString(time.travelTime)}
          </div>}
          {
              time?.waitingTime && <div className={'timeLine'}>
                Время ожидания в очереди: {msecToString(time.waitingTime)}
              </div>
          }
          {
              time?.arrivalTimestamp && <div className={'timeLine'}>
                Прогнозируемая дата прибытия: {time.arrivalTimestamp.toDateString()}
              </div>
          }
        <div className={'divider'}/>
          { office.openHours[0].days !== 'Не обслуживает ЮЛ' && <UserTypeButton individual={individual} setIndividual={setIndividual} />}
          {individual ?
              office?.openHoursIndividual && <WorkFours title={'Режим работы для физ. лиц'} data={office.openHoursIndividual}/>
          : office?.openHours && <WorkFours title={'Режим работы для юр. лиц'} data={office.openHours}/>
          }
          {individual ?
              office?.openHoursIndividual && <BarChart title={'Загруженность отделения для физ. лиц'} load={office?.loadIndividuals}/>
             : office?.load && <BarChart title={'Загруженность отделения для юр. лиц'} load={office?.load}/>
          }
          {
            individual ? <ServiceList data={officeIndividualService}/> : <ServiceList data={officeService}/>
          }
        <div className={'divider'}/>
          {
            !number ?  <div className={'talonchikButton'} onClick={(e) => {
              setOpenModal(true)
              e.stopPropagation()
            }}>
              Получить талон
            </div> :
                <div className={'talonchikNumber'}>
                  {`Ваш талон номер: ${number}. Время получения ${now}.`}
                </div>
          }
          <TalonchikModal open={openModal} setOpen={setOpen} setNumber={setNumber} services={officeService}/>
          {(office.hasRamp) &&  <p className={'Capobility text'}>
            Специальные возможности
          </p>}
          {
              office.hasRamp && <p className={'invalids text'}>
                {`- Для маломобильных граждан`}
              </p>
          }
        </SimpleBar>
      </div>
  )
}

export const PopoverATM = ({atm, time}: { atm: IAtm, time: ITime | null   }) => {
  const [individual, setIndividual] = useState(true)
  return(
      <div className="popover">
        <SimpleBar style={{ maxHeight: '100%' }}>
          <p className={'popoverName'}>Банкомат</p>
          <img src={"public/ATM-photo.jpg"} className={"photo"}  alt=''/>
          <p className={'popoverAddress'}>{atm?.address}</p>
          {time?.travelTime && <div className={'timeLine'}>
            Время в пути: {msecToString(time.travelTime)}
          </div>}
          {
            time?.waitingTime && <div className={'timeLine'}>
            Время ожидания в очереди: {msecToString(time.waitingTime)}
              </div>
          }
          {
            time?.arrivalTimestamp && <div className={'timeLine'}>
            Прогнозируемая дата прибытия: {time.arrivalTimestamp.toDateString()}
              </div>
          }
          <div className={'divider'}/>
          { <UserTypeButton individual={individual} setIndividual={setIndividual} />}
             {atm?.load && <BarChart title = 'Загруженность банкомата' load={atm?.load}/>}
          {
            individual ? <ServiceList data={atmIndividualService}/> : <ServiceList data={atmService}/>
          }
          <div className={'divider'}/>
          {(atm.services.blind || atm.services.wheelchair) &&  <p className={'Capobility text'}>
              Специальные возможности
            </p>}
          {atm.services.blind && <p className={'invalids text'}>
            {`-  Для с людей с ограничениями по зрению`}
          </p>}
          {
            atm.services.wheelchair && <p className={'invalids text'}>
                {`- Для маломобильных граждан`}
              </p>
          }
        </SimpleBar>
      </div>
  )
}

export const Popover = ({ office, atm, time }: IPopoverProps) => {
  if (office) return (<PopoverOffice office={office} time={time}/>)
  if (atm) return (<PopoverATM atm={atm} time={time}/>)
  return null
};
