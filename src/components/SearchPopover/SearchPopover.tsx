import React, {useEffect, useState} from "react";
import './SearchPopover.css'
import cn from "classnames";
import {atmIndividualService, atmService, officeIndividualService, officeService} from "../../config.ts";
import {ServiceModal} from "./ServiceModal.tsx";
import Checkbox from '@mui/material/Checkbox';
import {IAtm, IOffice, IRanked, IRankingResult} from "../../types.ts";
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import {LeafletMouseEvent} from "leaflet";


interface ISearchPopoverProps {
    atmSelect: (e: LeafletMouseEvent, atm: IAtm) => void
    officeSelect: (e: LeafletMouseEvent, bank: IOffice) => void

    individual:boolean
    setIndividual: ( individual:boolean) => void
    office: boolean
    setOffice: (office: boolean) => void
    car: boolean
    setCar: (car: boolean) => void
    service: string
    setService: (service: string) => void
    blind: boolean
    setBlind: (blind: boolean) => void
    wheel: boolean
    setWheel: (wheel: boolean) => void
    rankingResult: IRankingResult | null
}

interface IUserTypeButtonProps {
    individual: boolean,
    setIndividual: (individual: boolean) => void
}

interface IOfficeTypeButtonProps {
    office: boolean,
    setOffice: (office: boolean) => void
}

interface ICarTypeButtonProps {
    car: boolean,
    setCar: (office: boolean) => void
}


const CarRadioButton = ({car, setCar}: ICarTypeButtonProps  ) => {
    return (<div className={'userTypeContainer'}>
        <div className={cn('userTypeButton', car && 'userTypeButtonActive')} onClick={() => {
            setCar(true)
        }}>
            На машине
        </div>
        <div className={cn('userTypeButton', !car && 'userTypeButtonActive')} onClick={() => {
            setCar(false)
        }}>
            Пешком
        </div>
    </div>)
}

const BankRadioButton = ({office, setOffice}: IOfficeTypeButtonProps  ) => {
    return (<div className={'userTypeContainer'}>
        <div className={cn('userTypeButton', office && 'userTypeButtonActive')} onClick={() => {
            setOffice(true)
        }}>
            Отделение банка
        </div>
        <div className={cn('userTypeButton', !office && 'userTypeButtonActive')} onClick={() => {
            setOffice(false)
        }}>
            Банкомат
        </div>
    </div>)
}

const UserRadioButton = ({individual, setIndividual}: IUserTypeButtonProps  ) => {
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

export const SearchPopover = ({atmSelect, officeSelect, car, setCar, blind, setBlind, rankingResult, wheel, setWheel, individual, setIndividual, service, setService, setOffice, office}: ISearchPopoverProps) => {
    const [serviceList, setServiceList] = useState<string[]>(officeIndividualService)
    const [openModal, setOpenModal] = useState(false)

    useEffect(() => {
        if (individual && office) setServiceList(officeIndividualService)
        if (!individual && office) setServiceList(officeService)
        if (individual && !office) setServiceList(atmIndividualService)
        if (!individual && !office) setServiceList(atmService)
    }, [individual, office]);

    function msecToString(val: number) {
        var mins = Math.round(val / 60000);
        const hours = Math.floor(mins / 60);
        mins %= 60;
        if (mins < 10)
            mins = '0' + mins;
        return hours + 'ч. ' + mins + 'мин.';
    }

    const handleClick = (item: IRanked | undefined) => {
        if (!item) return
        console.log(item?.target)
        if (item.targetType === 'atm') {
            atmSelect(undefined, item.target)
        }
        if (item.targetType === 'office') {
            officeSelect(undefined, item.target)
        }
    }

    return (
        <div className={'searchPopover'}>
            <SimpleBar style={{ maxHeight: '100%'}}>
                <div className={'simplebarContent'}>


            <p className={'text generalTitle'}>
               Поиск маршрута.
            </p>
            <UserRadioButton individual={individual} setIndividual={setIndividual}/>
            <BankRadioButton office={office} setOffice={setOffice}/>
            <CarRadioButton car={car} setCar={setCar}/>

            <div className={'serviceChanger text'} onClick={() => setOpenModal(true)}>
               Выбрать услугу
            </div>
            { service && <div className={'text'}>
                {`Выбрана услуга: ${service}.`  }
            </div> }
            <ServiceModal open={openModal} setOpen={setOpenModal} services={serviceList} setService={setService}/>
            <div className={'invalidLabel'}>
                <Checkbox sx={{color: 'white'}} value={blind} onChange={(event, checked) => {setBlind(checked)}}/>
                Для с людей с ограничениями по зрению
            </div>
            <div className={'invalidLabel'}>
                <Checkbox sx={{color: 'white'}} value={wheel} onChange={(event, checked) => {setWheel(checked)}}/>
                Для маломобильных граждан
            </div>
            <div className={'divider'}/>
                { (rankingResult?.bestTravelTime || rankingResult?.bestWaitingTime) &&<div className={'travelTitle'}>
                Лучшие варианты
            </div> }
            {
                rankingResult?.bestTravelTime && <div className={'buttonTravel'} onClick={() => {
                    handleClick(rankingResult?.bestWaitingTime)
                }}>
                <div style={{color: '#969696'}}>
                    {rankingResult.bestTravelTime.target.address}
                </div>
                <div>
                    {`Наименьшее время в дороге: ${msecToString(rankingResult.bestTravelTime.travelTime)}`}
                </div>
                <div>
                    {`Время в очереди: ${msecToString(rankingResult.bestTravelTime.waitingTime)}`}
                </div>
                <div>
                    {`Общее время: ${msecToString(rankingResult.bestTravelTime.summaryTime)}`}
                </div>
                </div>
            }
            {
                rankingResult?.bestWaitingTime && <div className={'buttonTravel'} onClick={() => {
                    handleClick(rankingResult.bestTravelTime)
                }}>
                    <div style={{color: '#969696'}}>
                        {rankingResult.bestWaitingTime.target.address}
                    </div>
                    <div>
                        {`Наименьшее время в очереди: ${msecToString(rankingResult.bestWaitingTime.waitingTime)}`}
                    </div>
                    <div>
                        {`Время в пути: ${msecToString(rankingResult.bestWaitingTime.travelTime)}`}
                    </div>
                    <div>
                        {`Общее время: ${msecToString(rankingResult.bestWaitingTime.summaryTime)}`}
                    </div>
                </div>
            }
                {rankingResult?.top && rankingResult?.top.length !== 0 && <div className={'divider'}/>}
                {rankingResult?.top && rankingResult?.top.length !== 0 && <div className={'travelTitle'}>
                Топ вариантов с минимальным сумарным временем.
            </div>}
            {
                rankingResult?.top && rankingResult?.top.length !== 0 && rankingResult.top.map((r) =>
                    <div className={'buttonTravel'} onClick={() => {
                        handleClick(r)
                    }}>
                        <div style={{color: '#969696'}}>
                            {r.target.address}
                        </div>
                        <div>
                            {`Время в очереди: ${msecToString(r.waitingTime)}`}
                        </div>
                        <div>
                            {`Время в пути: ${msecToString(r.travelTime)}`}
                        </div>
                        <div>
                            {`Общее время: ${msecToString(r.summaryTime)}`}
                        </div>
                    </div>
                )
            }
                </div>
            </SimpleBar>
        </div>
    )
}

