import {useEffect, useState} from "react";
import './SearchPopover.css'
import cn from "classnames";
import {atmIndividualService, atmService, officeIndividualService, officeService} from "../../config.ts";
import {ServiceModal} from "./ServiceModal.tsx";
import Checkbox from '@mui/material/Checkbox';
interface ISearchPopoverProps {

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

export const SearchPopover = ({}: ISearchPopoverProps) => {
    const [individual, setIndividual] = useState(true)
    const [office, setOffice] = useState(true)
    const [car, setCar] = useState(false)
    const [service, setService] = useState("")
    const [serviceList, setServiceList] = useState<string[]>(officeIndividualService)
    const [openModal, setOpenModal] = useState(false)

    const [blind, setBlind] = useState(false)
    const [wheel, setWheel] = useState(false)

    useEffect(() => {
        if (individual && office) setServiceList(officeIndividualService)
        if (!individual && office) setServiceList(officeService)
        if (individual && !office) setServiceList(atmIndividualService)
        if (!individual && !office) setServiceList(atmService)
    }, [individual, office]);

    return (
        <div className={'searchPopover'}>
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
                <Checkbox defaultChecked value={blind} onChange={(event, checked) => {setBlind(checked)}}/>
                Для с людей с ограничениями по зрению
            </div>
            <div className={'invalidLabel'}>
                <Checkbox defaultChecked value={wheel} onChange={(event, checked) => {setWheel(checked)}}/>
                Для маломобильных граждан
            </div>

        </div>
    )
}

