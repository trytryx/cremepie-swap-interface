import { ChainId } from '@cremepie/sdk'
import React from 'react'
import { Text } from 'rebass'
// import { NavLink } from 'react-router-dom'
// import { darken } from 'polished'
// import { useTranslation } from 'react-i18next'

import styled from 'styled-components'

import Logo from '../../assets/svg/logo-cremepie.svg'
import LogoMobile from '../../assets/svg/cremepie_mini.svg'
import MenuOpen from '../../assets/svg/menu_open.svg'
import MenuClose from '../../assets/svg/menu_close.svg'
import { useActiveWeb3React } from '../../hooks'
// import { useDarkModeManager } from '../../state/user/hooks'
import { useETHBalances } from '../../state/wallet/hooks'
import { CardNoise } from '../earn/styled'
// import { CountUp } from 'use-count-up'
import { TYPE } from '../../theme'

import { YellowCard } from '../Card'

import { RowFixed } from '../Row'
import Web3Status from '../Web3Status'
import ClaimModal from '../claim/ClaimModal'
import { useToggleSelfClaimModal, useShowClaimPopup } from '../../state/application/hooks'
import { useUserHasAvailableClaim } from '../../state/claim/hooks'
import { useUserHasSubmittedClaim } from '../../state/transactions/hooks'
import { Dots } from '../swap/styleds'
// import { isMobile } from 'react-device-detect'

const HeaderFrame = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  transition: top 0.2s ease 0s;
  display: flex;
  -webkit-box-pack: justify;
  justify-content: space-between;
  -webkit-box-align: center;
  align-items: center;
  padding-right: 16px;
  width: 100%;
  height: 64px;
  background: ${({ theme }) => theme.bg1};
  border-bottom: 2px solid rgba(133, 133, 133, 0.1);
  z-index: 20;
  transform: translate3d(0px, 0px, 0px);
`

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: row;
    justify-content: space-between;
    justify-self: center;
    width: 100%;
    max-width: 960px;
    padding: 1rem 0;
    position: absolute;
    left: calc(100vw - 285px);
    width: 100%;
    z-index: 99;
    height: 62px;
    background-color: ${({ theme }) => theme.bg1};
  `};
  ${({ theme }) => theme.mediaWidth.upToSmall`
    left: calc(100vw - 300px);
    padding: 1rem 0;
  `};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    left: calc(100vw - 165px);
    padding: 1rem 0;
  `};
`

const HeaderElement = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    margin-right: 0;
  `};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    gap: 5px;
  `};
`

// const HeaderElementWrap = styled.div`
//   display: flex;
//   align-items: center;
// `

const HeaderRow = styled(RowFixed)`
  ${({ theme }) => theme.mediaWidth.upToMedium`
   width: 100%;
   min-height: 60px;
  `};
`

// const HeaderLinks = styled(Row)`
//   justify-content: center;

//   @media (max-width: 767px) {
//     display: block;
//     height: ${({ theme, showMenu }) => (showMenu ? '220px' : '0px')};
//     overflow: hidden;
//     transition: all 0.15s linear;
//   }

//   ${({ theme }) => theme.mediaWidth.upToMedium`
//     justify-content: flex-end;
// `};
// `

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme, active }) => (!active ? theme.bg1 : theme.bg2)};
  border-radius: 40px;
  white-space: nowrap;
  width: 100%;
  cursor: pointer;

  :focus {
    border: 1px solid blue;
  }
`

const UNIAmount = styled(AccountElement)`
  color: white;
  padding: 4px 8px;
  height: 36px;
  font-family: SFPro500;
  background-color: ${({ theme }) => theme.bg3};
  background: radial-gradient(174.47% 188.91% at 1.84% 0%, #ff007a 0%, #f0b90b 100%), #edeef2;
`

const UNIWrapper = styled.span`
  width: fit-content;
  position: relative;
  cursor: pointer;

  :hover {
    opacity: 0.8;
  }

  :active {
    opacity: 0.9;
  }
`

const HideSmall = styled.span`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`

const NetworkCard = styled(YellowCard)`
  border-radius: 12px;
  padding: 8px 12px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: 0;
    margin-right: 0.5rem;
    width: initial;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-shrink: 1;
  `};
`

const BalanceText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`

const Title = styled.a`
  display: flex;
  align-items: center;
  pointer-events: auto;
  justify-self: flex-start;
  margin-right: 12px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-self: center;
  `};
  :hover {
    cursor: pointer;
  }
`

const UniIcon = styled.div`
  transition: transform 0.3s ease;
  height: 32px;
`

// const activeClassName = 'ACTIVE'

// const StyledNavLink = styled(NavLink).attrs({
//   activeClassName
// })`
//   ${({ theme }) => theme.flexRowNoWrap}
//   align-items: left;
//   border-radius: 3rem;
//   outline: none;
//   cursor: pointer;
//   text-decoration: none;
//   color: ${({ theme }) => theme.text2};
//   font-size: 1rem;
//   width: fit-content;
//   margin: 0 12px;
//   font-weight: 400;

//   &.${activeClassName} {
//     border-radius: 12px;
//     font-weight: 600;
//     color: ${({ theme }) => theme.text1};
//   }

//   :hover,
//   :focus {
//     color: ${({ theme }) => darken(0.1, theme.text1)};
//   }
//   @media (max-width: 767px) {
//     margin: 0 0px;
//     padding: 12px 16px;
//     justify-content: flex-end;
//     width: 100%;
//   }
// `

// const StyledAbsoluteLink = styled.a`
//   color: rgb(195, 197, 203);
//   font-weight: 400;
//   padding-left: 8px;
//   padding-right: 8px;
//   text-decoration: none;
//   display: flex;

//   &:hover {
//     color: #ffffff;
//   }
//   &.active {
//     color: rgb(195, 197, 203);
//   }
//   @media (max-width: 767px) {
//     padding: 12px 16px;
//     justify-content: flex-end;
//   }
// `

const MenuIcon = styled.div`
  transition: transform 0.3s ease;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background: transparent;
  width: 56px;
`

const WrapLinkDesktop = styled.div`
  display: block;
  @media (max-width: 767px) {
    display: none;
  }
`

// const WrapLinkMobile = styled.div`
//   display: none;
//   @media (max-width: 767px) {
//     display: block;
//   }
// `

const NETWORK_LABELS: { [chainId in ChainId]?: string } = {
  [ChainId.MAINNET]: undefined,
  [ChainId.RINKEBY]: 'Rinkeby',
  [ChainId.ROPSTEN]: 'Ropsten',
  [ChainId.GÖRLI]: 'Görli',
  [ChainId.KOVAN]: 'Kovan',
  [ChainId.BSC_MAINNET]: undefined,
  [ChainId.BSC_TESTNET]: 'testnet',
  [ChainId.POLYGON_MAINNET]: undefined,
  [ChainId.POLYGON_TESTNET]: 'testnet'
}

interface HeaderProps {
  set_show_menu: () => void,
  showMenu: boolean
}

export default function Header({
  set_show_menu,
  showMenu
}: HeaderProps) {
  const { account, chainId } = useActiveWeb3React()
  // const { t } = useTranslation()

  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  // const [isDark] = useDarkModeManager()

  const toggleClaimModal = useToggleSelfClaimModal()

  const availableClaim: boolean = useUserHasAvailableClaim(account)

  const { claimTxn } = useUserHasSubmittedClaim(account ?? undefined)

  // const aggregateBalance: TokenAmount | undefined = useAggregateUniBalance()

  // const [showUniBalanceModal, setShowUniBalanceModal] = useState(false)
  const showClaimPopup = useShowClaimPopup()

  // const countUpValue = aggregateBalance?.toFixed(0) ?? '0'
  // const countUpValuePrevious = usePrevious(countUpValue) ?? '0'
  // const HeaderLink = (
  //   <HeaderLinks showMenu={showMenu}>
  //     <StyledNavLink id={`swap-nav-link`} to={'/swap'}>
  //       AMMv1
  //     </StyledNavLink>
  //     <StyledNavLink
  //       id={`pool-nav-link`}
  //       to={'/pool'}
  //       isActive={(match, { pathname }) =>
  //         Boolean(match) ||
  //         pathname.startsWith('/add') ||
  //         pathname.startsWith('/remove') ||
  //         pathname.startsWith('/create') ||
  //         pathname.startsWith('/find')
  //       }
  //     >
  //       {t('pool')}
  //     </StyledNavLink>
  //     {/*<StyledNavLink id={`stake-nav-link`} to={'/uni'}>
  //     UNI
  //   </StyledNavLink>
  //   <StyledNavLink id={`stake-nav-link`} to={'/vote'}>
  //     Vote
  //   </StyledNavLink>*/}
  //     <StyledAbsoluteLink href={'https://launchpoolx.bscex.org'}>LaunchpoolX</StyledAbsoluteLink>
  //     <StyledAbsoluteLink href={'https://swapx.bscex.org'}>SwapX</StyledAbsoluteLink>
  //     <StyledAbsoluteLink href={'https://governance.bscex.org'}>Governance</StyledAbsoluteLink>
  //   </HeaderLinks>
  // )

  const isMobile = window.innerWidth < 500

  return (
    <HeaderFrame>
      <ClaimModal />
      <HeaderRow>
        <MenuIcon>
          <img onClick={() => set_show_menu()} width={'25px'} src={showMenu ? MenuOpen : MenuClose} alt="menu" />
        </MenuIcon>
        <Title href="https://cremepieswapfinance.com/">
          <UniIcon>
            {isMobile ? 
            <img src={LogoMobile} alt="logo" /> :
            <img width={'160px'} src={Logo} alt="logo" />
            }
          </UniIcon>
        </Title>
        <WrapLinkDesktop></WrapLinkDesktop>
      </HeaderRow>
      <HeaderControls>
        <HeaderElement>
          <HideSmall>
            {chainId && NETWORK_LABELS[chainId] && (
              <NetworkCard title={NETWORK_LABELS[chainId]}>{NETWORK_LABELS[chainId]}</NetworkCard>
            )}
          </HideSmall>
          {availableClaim && !showClaimPopup && (
            <UNIWrapper onClick={toggleClaimModal}>
              <UNIAmount active={!!account && !availableClaim} style={{ pointerEvents: 'auto' }}>
                <TYPE.white padding="0 2px">
                  {claimTxn && !claimTxn?.receipt ? <Dots>Claiming UNI</Dots> : 'Claim UNI'}
                </TYPE.white>
              </UNIAmount>
              <CardNoise />
            </UNIWrapper>
          )}

          <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
            {account && userEthBalance ? (
              <BalanceText style={{ flexShrink: 0 }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
                {userEthBalance?.toSignificant(4)} MATIC
              </BalanceText>
            ) : null}
            <Web3Status />
          </AccountElement>
        </HeaderElement>
        {/* <HeaderElementWrap>
          <Settings />
        </HeaderElementWrap> */}
      </HeaderControls>
    </HeaderFrame>
  )
}
