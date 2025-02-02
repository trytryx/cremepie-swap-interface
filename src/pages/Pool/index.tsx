import React, { useContext, useMemo, useState } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { Pair } from '@cremepie/sdk'
import { Link } from 'react-router-dom'
import { SwapPoolTabs } from '../../components/NavigationTabs'

import FullPositionCard from '../../components/PositionCard'
import { useUserHasLiquidityInAllTokens } from '../../data/V1'
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { TYPE } from '../../theme'
import { Text } from 'rebass'
import Card from '../../components/Card'
import { RowBetween, RowFixed } from '../../components/Row'
import { ButtonPrimary, ButtonSecondary, ButtonLight } from '../../components/Button'
import { AutoColumn } from '../../components/Column'
import LiquidityDescription from '../../components/LiquidityDescription'

import AppBody from '../AppBody'

import { useActiveWeb3React } from '../../hooks'
import { usePairs } from '../../data/Reserves'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../../state/user/hooks'
import { useWalletModalToggle } from '../../state/application/hooks'
import { Dots } from '../../components/swap/styleds'

const TitleRow = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-wrap: wrap;
    gap: 12px;
    width: 100%;
    flex-direction: column-reverse;
  `};
`

const ButtonRow = styled(RowFixed)`
  gap: 8px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
    flex-direction: row-reverse;
    justify-content: space-between;
  `};
`

const ResponsiveButtonPrimary = styled(ButtonPrimary)`
  width: fit-content;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 48%;
  `};
`

const ResponsiveButtonSecondary = styled(ButtonSecondary)`
  width: fit-content;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 48%;
  `};
`

const EmptyProposals = styled.div`
  margin: 0 40px;
  padding: 16px 12px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) => theme.bg2};
`

export default function Pool() {
  const theme = useContext(ThemeContext)
  const { account } = useActiveWeb3React()

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map(tokens => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs]
  )
  const liquidityTokens = useMemo(() => tokenPairsWithLiquidityTokens.map(tpwlt => tpwlt.liquidityToken), [
    tokenPairsWithLiquidityTokens
  ])
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens
  )

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0')
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances]
  )

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances || v2Pairs?.length < liquidityTokensWithBalances.length || v2Pairs?.some(V2Pair => !V2Pair)

  const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))

  const hasV1Liquidity = useUserHasLiquidityInAllTokens()

  const [show_pool_detail, set_show_pool_detail] = useState(false)


  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle()

  return (
    <>
      <AppBody>
        <SwapPoolTabs active={'pool'} />
        <AutoColumn gap="lg" justify="center">
          <AutoColumn gap="lg" style={{ width: '100%' }}>
            {!account ? (
              <Card padding="40px">
                <TYPE.body color={theme.text1} textAlign="center" marginBottom="1rem">
                  Connect to a wallet to view your liquidity.
                </TYPE.body>
                <ButtonLight onClick={toggleWalletModal}>Connect Wallet</ButtonLight>
              </Card>
            ) : v2IsLoading ? (
              <EmptyProposals>
                <TYPE.body color={theme.text3} textAlign="center">
                  <Dots>Loading</Dots>
                </TYPE.body>
              </EmptyProposals>
            ) : allV2PairsWithLiquidity?.length > 0 ? (
              <>
                {/*<ButtonSecondary>
                  <RowBetween>
                    <ExternalLink href={'https://uniswap.info/account/' + account}>
                      Account analytics and accrued fees
                    </ExternalLink>
                    <span> ↗</span>
                  </RowBetween>
                </ButtonSecondary>*/}

                {allV2PairsWithLiquidity.map(v2Pair => (
                  <FullPositionCard 
                    key={v2Pair.liquidityToken.address} 
                    pair={v2Pair} 
                    showDetail={() => set_show_pool_detail(!show_pool_detail)}
                  />
                ))}
                {!show_pool_detail && 
                <>
                  <Text textAlign="center" fontSize={14}>
                      {hasV1Liquidity ? 'Uniswap V1 liquidity found!' : "Don't see a pool you joined?"}{' '}
                  </Text>
                  <ResponsiveButtonSecondary 
                      as={Link} 
                      id="import-pool-link" 
                      to={hasV1Liquidity ? '/migrate/v1' : '/find'}
                    >
                      {hasV1Liquidity ? 'Migrate now.' : 'Find Other LP tokens'}
                  </ResponsiveButtonSecondary>
                </>
                }
              </>
            ) : (
              <EmptyProposals>
                <TYPE.body fontSize={14} color={theme.text1} textAlign="center" style={{marginBottom: 10}}>
                  No liquidity found.
                </TYPE.body>
                <TYPE.body color={theme.text1} textAlign="center">
                  <Text textAlign="center" fontSize={14} style={{ padding: '.5rem 0 .5rem 0', marginBottom: 5 }}>
                    {hasV1Liquidity ? 'Uniswap V1 liquidity found!' : "Don't see a pool you joined?"}{' '}
                  </Text>
                  <ResponsiveButtonSecondary 
                    as={Link} 
                    id="import-pool-link" 
                    to={hasV1Liquidity ? '/migrate/v1' : '/find'}
                  >
                    {hasV1Liquidity ? 'Migrate now.' : 'Find LP tokens'}
                  </ResponsiveButtonSecondary>
                </TYPE.body>
              </EmptyProposals>
            )}
            {!account || !show_pool_detail && 
            <>
              <TitleRow style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }} padding={'0'}>
                <ButtonRow>
                  <ResponsiveButtonPrimary id="join-pool-button" as={Link} padding="6px 8px" to="/add/MATIC">
                    <Text fontWeight={500} fontSize={16}>
                      Add Liquidity
                    </Text>
                  </ResponsiveButtonPrimary>
                </ButtonRow>
              </TitleRow>
              <TitleRow style={{display: 'flex', justifyContent: 'center' }} padding={'0'}>
                <ButtonRow>
                  <ResponsiveButtonSecondary as={Link} padding="6px 8px" to="/create/MATIC">
                    Create a pair
                  </ResponsiveButtonSecondary>
                </ButtonRow>
              </TitleRow>
            </>}
            <AutoColumn justify={'center'} gap="md">
            </AutoColumn>
          </AutoColumn>
        </AutoColumn>
      </AppBody>
      <LiquidityDescription/>
    </>
  )
}
