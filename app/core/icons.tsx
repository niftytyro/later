import { Icon } from "@chakra-ui/react"
import React from "react"

interface TileIconProps {
  active: boolean
  size?: number
}

export const TwitterIcon: React.FC<TileIconProps> = ({ active, size = 6 }) => {
  return (
    <Icon boxSize={size}>
      {active ? (
        <svg width="24" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M24 2.366a9.641 9.641 0 0 1-2.828.795A5.043 5.043 0 0 0 23.337.37a9.69 9.69 0 0 1-3.127 1.225A4.86 4.86 0 0 0 16.616 0c-2.718 0-4.923 2.26-4.923 5.048 0 .396.044.781.127 1.151C7.728 5.99 4.1 3.98 1.672.925a5.122 5.122 0 0 0-.666 2.538 5.08 5.08 0 0 0 2.19 4.201 4.809 4.809 0 0 1-2.23-.63v.063c0 2.446 1.696 4.486 3.949 4.95a4.874 4.874 0 0 1-2.224.088c.626 2.005 2.445 3.465 4.598 3.506A9.723 9.723 0 0 1 0 17.73 13.683 13.683 0 0 0 7.547 20c9.056 0 14.008-7.693 14.008-14.364 0-.219-.005-.436-.015-.653A10.178 10.178 0 0 0 24 2.366Z"
            fill="#4BC8FF"
          />
        </svg>
      ) : (
        <svg width="24" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M24 2.366a9.641 9.641 0 0 1-2.828.795A5.043 5.043 0 0 0 23.337.37a9.69 9.69 0 0 1-3.127 1.225A4.86 4.86 0 0 0 16.616 0c-2.718 0-4.923 2.26-4.923 5.048 0 .396.044.781.127 1.151C7.728 5.99 4.1 3.98 1.672.925a5.122 5.122 0 0 0-.666 2.538 5.08 5.08 0 0 0 2.19 4.201 4.809 4.809 0 0 1-2.23-.63v.063c0 2.446 1.696 4.486 3.949 4.95a4.874 4.874 0 0 1-2.224.088c.626 2.005 2.445 3.465 4.598 3.506A9.723 9.723 0 0 1 0 17.73 13.683 13.683 0 0 0 7.547 20c9.056 0 14.008-7.693 14.008-14.364 0-.219-.005-.436-.015-.653A10.178 10.178 0 0 0 24 2.366Z"
            fill="#999"
          />
        </svg>
      )}
    </Icon>
  )
}

export const ArticlesIcon: React.FC<TileIconProps> = ({ active, size = 6 }) => {
  return (
    <Icon boxSize={size}>
      {active ? (
        <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#a)">
            <path
              d="M3 3v20.25a.75.75 0 0 0 1.11.659L12 19.604l7.89 4.305A.75.75 0 0 0 21 23.25V3a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3Z"
              fill="#fff"
            />
          </g>
          <defs>
            <clipPath id="a">
              <path fill="#fff" d="M0 0h24v24H0z" />
            </clipPath>
          </defs>
        </svg>
      ) : (
        <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#a)">
            <path
              d="M3 3v20.25a.75.75 0 0 0 1.11.659L12 19.604l7.89 4.305A.75.75 0 0 0 21 23.25V3a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3Z"
              fill="#999"
            />
          </g>
          <defs>
            <clipPath id="a">
              <path fill="#fff" d="M0 0h24v24H0z" />
            </clipPath>
          </defs>
        </svg>
      )}
    </Icon>
  )
}

export const YoutubeIcon: React.FC<TileIconProps> = ({ active, size = 6 }) => {
  return (
    <Icon boxSize={size}>
      {active ? (
        <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M23.476 6.662a3.039 3.039 0 0 0-2.125-2.148C19.486 4 11.985 4 11.985 4s-7.502.016-9.366.53A3.039 3.039 0 0 0 .493 6.677C0 8.56 0 12.5 0 12.5s0 3.939.508 5.838a3.039 3.039 0 0 0 2.126 2.148C4.498 21 12 21 12 21s7.502 0 9.366-.514a3.039 3.039 0 0 0 2.126-2.148C24 16.454 24 12.5 24 12.5s-.015-3.939-.524-5.838Z"
            fill="red"
          />
          <path d="M15.82 12.645 9.597 9v7.29l6.223-3.645Z" fill="#fff" />
        </svg>
      ) : (
        <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M23.476 6.662a3.039 3.039 0 0 0-2.125-2.148C19.486 4 11.985 4 11.985 4s-7.502.016-9.366.53A3.039 3.039 0 0 0 .493 6.677C0 8.56 0 12.5 0 12.5s0 3.939.508 5.838a3.039 3.039 0 0 0 2.126 2.148C4.498 21 12 21 12 21s7.502 0 9.366-.514a3.039 3.039 0 0 0 2.126-2.148C24 16.454 24 12.5 24 12.5s-.015-3.939-.524-5.838Z"
            fill="#999"
          />
          <path d="M15.82 12.645 9.597 9v7.29l6.223-3.645Z" fill="#fff" />
        </svg>
      )}
    </Icon>
  )
}
