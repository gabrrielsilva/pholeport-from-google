import classNames from '../utils/classNames'

type ButtonProps = {
  text: string,
  extraStyles: string
  onClick?: () => void,
}

export const Button = ({ text, onClick, extraStyles }: ButtonProps) => {
  return (
    <button onClick={onClick} className={classNames('px-5 py-3 text-lg font-bold rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent transition-colors duration-200', extraStyles)}>{text}</button>
  )
}
