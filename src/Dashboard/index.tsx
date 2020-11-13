import React, { useEffect } from 'react'
import styled from 'styled-components'
import UniqueObservable, {
  UniqueObservableType,
} from '../Observable/UniqueObservable'

const DashboardWrapp = styled.div`
  font-size: 80px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`

const System = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  .value {
    color: red;
  }
`

export default function Dashboard() {
  const [uniqueObservable, setUniqueObservable] = React.useState<
    UniqueObservableType
  >({} as UniqueObservableType)

  useEffect(() => {
    const uniqueObservable = new UniqueObservable()
    uniqueObservable.subscribe((value: UniqueObservableType) =>
      setUniqueObservable(value)
    )

    return uniqueObservable.unsubscribe
  }, [])

  return (
    <DashboardWrapp>
      <System>
        <span>Temperature</span>
        <span className="value">{uniqueObservable.temperature}</span>
      </System>
      <System>
        <span>Air Pressure</span>
        <span className="value">{uniqueObservable.airPressure}</span>
      </System>
      <System>
        <span>Humidity</span>
        <span className="value">{uniqueObservable.humidity}</span>
      </System>
    </DashboardWrapp>
  )
}
