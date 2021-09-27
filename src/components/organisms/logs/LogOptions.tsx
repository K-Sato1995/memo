import React from 'react'
import styled from 'styled-components'

const OptionsContainer = styled.form`
  position: absolute;
  top: 10%;
  right: 1%;
  background: #fff;
  z-index: 1000;
  width: 150px;
  text-align: center;
  border-radius: 2.5px;
  box-shadow: 0 1px 10px 0 rgb(0 0 0 / 25%);
`

const OptionsList = styled.ul`
  padding: 0;
  margin: 0;
  list-style: none;
`

const OptionItem = styled.li`
  display: inline-block;
  padding: 0.7rem 0;
  width: 100%;
  border-bottom: solid 1px ${(props) => props.theme.borderColor};
  color: ${(props) => props.theme.secondaryColor};
  cursor: pointer;
  :hover {
    color: ${(props) => props.theme.primaryColor};
  }
`

interface Props {
  handleDelete: () => void
  setIsModalDisplayed: React.Dispatch<React.SetStateAction<boolean>>
  setIsOptionListDisplayed: React.Dispatch<React.SetStateAction<boolean>>
}

export const LogOptions = ({
  setIsOptionListDisplayed,
  setIsModalDisplayed,
  handleDelete,
}: Props) => {
  return (
    <OptionsContainer>
      <OptionsList>
        <OptionItem
          onClick={() => {
            setIsOptionListDisplayed(false)
            setIsModalDisplayed(true)
          }}
        >
          Edit(NotAvailable)
        </OptionItem>
        <OptionItem
          onClick={() => {
            if (window.confirm('Are you sure you wish to delete this item?')) {
              handleDelete()
            }
          }}
        >
          Delete
        </OptionItem>
      </OptionsList>
    </OptionsContainer>
  )
}
