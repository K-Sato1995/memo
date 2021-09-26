import React from 'react'
import styled from 'styled-components'
import { Heading, ContentWrapper } from 'components/atoms'
import {
  NewLogForm,
  LogBox,
  LogItemOptions,
  EditLogItemForm,
} from 'components/organisms'
import CalendarHeatmap from 'react-calendar-heatmap'
import { DocumentData } from 'firebase/firestore'
import 'react-calendar-heatmap/dist/styles.css'
import { User } from 'firebase/auth'
import { FaEllipsisH } from 'react-icons/fa'
import { useDetectOutsideClick } from 'hooks'
import { Redirect } from 'react-router'

const ReactTooltip = React.lazy(() => import('react-tooltip'))

const TopContainer = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  padding: 0;
`

const LogsConatiner = styled.div`
  border: solid ${(props) => props.theme.borderColor} 1px;
  border-bottom: 0;
`

const OptionIcon = styled(FaEllipsisH)`
  color: ${(props) => props.theme.secondaryColor};
  cursor: pointer;
  margin: 1rem 0;

  :hover {
    color: ${(props) => props.theme.primaryColor};
  }
`

interface Props {
  currentUser: User
  itemID: string
  logItem: DocumentData | null
  logs: DocumentData[]
  formattedLogs: FormattedLog[]
  currTotalHours: number
  deleteLogItem: () => Promise<void>
  updateLogItem: (
    name: string,
    e: React.FormEvent<HTMLFormElement>,
  ) => Promise<void>
}

export const LogDetailTemplate = ({
  currentUser,
  itemID,
  logItem,
  logs,
  formattedLogs,
  currTotalHours,
  deleteLogItem,
  updateLogItem,
}: Props) => {
  const { uid } = currentUser
  const wrapperRef = React.useRef(null)
  const [
    isOptionListDisplayed,
    setIsOptionListDisplayed,
  ] = React.useState<boolean>(false)

  const [isEditing, setIsEditing] = React.useState<boolean>(false)

  useDetectOutsideClick(wrapperRef, setIsOptionListDisplayed)

  const getTooltipDataAttrs = (value: { date: string; count: number }) => {
    // Temporary hack around null value.date issue
    if (!value || !value.date) {
      return null
    }
    // Configuration for react-tooltip
    return {
      'data-tip': `${value.date.slice(0, 10)} | ${value.count} h`,
    }
  }

  const renderOptionList = () => {
    if (isEditing) return <></>
    return (
      <>
        {isOptionListDisplayed ? (
          <LogItemOptions
            setIsEditing={setIsEditing}
            handleDelete={() => {
              if (
                window.confirm('Are you sure you wish to delete this item?')
              ) {
                deleteLogItem()
              }
            }}
          />
        ) : (
          <OptionIcon
            onClick={() => {
              setIsOptionListDisplayed(true)
            }}
          />
        )}
      </>
    )
  }
  if (!logItem) return <Redirect to="/" />

  return (
    <ContentWrapper>
      <TopContainer ref={wrapperRef}>
        {isEditing ? (
          <EditLogItemForm
            logItem={logItem}
            updateLogItem={updateLogItem}
            setIsEditing={setIsEditing}
            setIsOptionListDisplayed={setIsOptionListDisplayed}
          />
        ) : (
          <Heading size={'h1'}>{logItem.name}</Heading>
        )}

        {renderOptionList()}
      </TopContainer>

      <ReactTooltip />
      <CalendarHeatmap
        startDate={new Date('2021-05-01')}
        endDate={new Date('2022-05-01')}
        values={formattedLogs}
        tooltipDataAttrs={getTooltipDataAttrs}
      />
      <NewLogForm itemID={itemID} currTotalHours={currTotalHours} uid={uid} />
      <LogsConatiner>
        {logs?.map((log) => (
          <LogBox
            key={log.id}
            currTotalHours={currTotalHours}
            logItemID={itemID}
            log={log}
          />
        ))}
      </LogsConatiner>
    </ContentWrapper>
  )
}
