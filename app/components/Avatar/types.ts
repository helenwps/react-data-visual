export type TSize = 'large' | 'default' | 'small'
export interface IAvatarProps {
  path?: string
  size?: 'profile' | TSize
  enlarge?: boolean
  border?: boolean
  hideContent?: boolean
}

export type TImageState = 'loading' | 'loaded' | 'loadFail'
