import React, { useState, useEffect, useCallback } from 'react'
import { BikeRentalStation } from '@entur/sdk'
import { Loader } from '@entur/loader'
import { SubParagraph } from '@entur/typography'
import { Contrast } from '@entur/layout'

import { useCounter } from '../../utils'

// @ts-ignore
import errorImage from '../../assets/images/noStops.png'
import TavlaLogo from '../../assets/icons/tavlaLogo'
import { Clock } from '../../components'
import { StopPlaceWithDepartures } from '../../types'

import Footer from './Footer'

import './styles.scss'

function DashboardWrapper(props: Props): JSX.Element {
    const secondsSinceMount = useCounter()

    const {
        className, children, history, bikeRentalStations, stopPlacesWithDepartures,
    } = props

    const onSettingsButtonClick = useCallback(event => {
        const path = window.location.pathname.split('@')[1]
        history.push(`/admin/@${path}`)
        event.preventDefault()
    }, [history])

    const [initialLoading, setInitialLoading] = useState<boolean>(true)

    useEffect(() => {
        if (initialLoading
            && (bikeRentalStations || typeof bikeRentalStations === 'undefined')
            && (stopPlacesWithDepartures || typeof stopPlacesWithDepartures === 'undefined')
        ) {
            setInitialLoading(false)
        }
    }, [bikeRentalStations, initialLoading, stopPlacesWithDepartures])

    const noData = (!stopPlacesWithDepartures || !stopPlacesWithDepartures.length) && (!bikeRentalStations || !bikeRentalStations.length)

    const renderContents = (): JSX.Element | Array<JSX.Element> => {
        if (!noData && !initialLoading) {
            return children
        }

        if (secondsSinceMount < 2) {
            return null
        }

        if (secondsSinceMount < 5) {
            return <Loader>Laster...</Loader>
        }

        return <img className="no-stops" src={errorImage} />
    }

    return (
        <div className={`dashboard-wrapper ${className}`}>
            { renderContents() }
            <Contrast>
                <Footer
                    className="dashboard-wrapper__footer"
                    history={history}
                    onSettingsButtonClick={onSettingsButtonClick}
                />
            </Contrast>
        </div>
    )
}

interface Props {
    stopPlacesWithDepartures?: Array<StopPlaceWithDepartures> | null,
    bikeRentalStations?: Array<BikeRentalStation> | null,
    className: string,
    children: JSX.Element | Array<JSX.Element>,
    history: any,
}

export default DashboardWrapper
