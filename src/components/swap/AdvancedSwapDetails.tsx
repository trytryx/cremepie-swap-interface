import { Trade, TradeType } from '@bscex/sdk'
import React, { useContext, useState } from 'react'
import { ThemeContext } from 'styled-components'
import { Field } from '../../state/swap/actions'
import { Text } from 'rebass'
import { useUserSlippageTolerance } from '../../state/user/hooks'
import { useToggleSettingsMenu } from '../../state/application/hooks'
import { TYPE } from '../../theme'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown } from '../../utils/prices'
import { AutoColumn } from '../Column'
import Card from '../Card'
import QuestionHelper from '../QuestionHelper'
import { RowBetween, RowFixed } from '../Row'
import FormattedPriceImpact from './FormattedPriceImpact'
import { SectionBreak } from './styleds'
import SwapRoute from './SwapRoute'
import TradePrice from './TradePrice'
import { ClickableText } from '../../pages/Pool/styleds'


// import { getRouterContract } from '../../utils'
// import { useActiveWeb3React } from '../../hooks'

// const InfoLink = styled(ExternalLink)`
//   width: 100%;
//   border: 1px solid ${({ theme }) => theme.bg3};
//   padding: 6px 6px;
//   border-radius: 8px;
//   text-align: center;
//   font-size: 14px;
//   color: ${({ theme }) => theme.text1};
// `

function TradeSummary({ trade, allowedSlippage }: { trade: Trade; allowedSlippage: number }) {
  const theme = useContext(ThemeContext)
  // const { account, chainId, library } = useActiveWeb3React()
  const { priceImpactWithoutFee, realizedLPFee } = computeTradePriceBreakdown(trade)
  // const isExactIn = trade.tradeType === TradeType.EXACT_INPUT
  const slippageAdjustedAmounts = computeSlippageAdjustedAmounts(trade, allowedSlippage)
  // const [amountBurn, setAmountBurn] = useState(0)
  // const amountBurn = 0
  // if (chainId && library && account) {
  //   const router = getRouterContract(chainId, library, account)
  //   const method = router.getAmountBurnTokenFee

  //   const args = [trade?.route?.path[0]?.address, trade.inputAmount.raw.toString()]
  //   method(...args).then((response: number) => {
  //     const decimals = trade?.route?.path[0]?.decimals
  //     setAmountBurn(Number(response) / Number(`1e${decimals}`))
  //   })
  // }
  const [showInverted, setShowInverted] = useState<boolean>(false)
  const toggleSettings = useToggleSettingsMenu()

  return (
    // <>
    //   <AutoColumn style={{ padding: '0 20px' }}>
    //     <RowBetween>
    //       <RowFixed>
    //         <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
    //           {isExactIn ? 'Minimum received' : 'Maximum sold'}
    //         </TYPE.black>
    //         <QuestionHelper text="Your transaction will revert if there is a large, unfavorable price movement before it is confirmed." />
    //       </RowFixed>
    //       <RowFixed>
    //         <TYPE.black color={theme.text1} fontSize={14}>
    //           {isExactIn
    //             ? `${slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4)} ${trade.outputAmount.currency.symbol}` ??
    //               '-'
    //             : `${slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4)} ${trade.inputAmount.currency.symbol}` ??
    //               '-'}
    //         </TYPE.black>
    //       </RowFixed>
    //     </RowBetween>
    //     <RowBetween>
    //       <RowFixed>
    //         <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
    //           Price Impact
    //         </TYPE.black>
    //         <QuestionHelper text="The difference between the market price and estimated price due to trade size." />
    //       </RowFixed>
    //       <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
    //     </RowBetween>

    //     <RowBetween>
    //       <RowFixed>
    //         <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
    //           Liquidity Provider Fee
    //         </TYPE.black>
    //         <QuestionHelper text="A portion of each trade (0.20%) goes to liquidity providers as a protocol incentive." />
    //       </RowFixed>
    //       <TYPE.black fontSize={14} color={theme.text1}>
    //         {realizedLPFee ? `${realizedLPFee.toSignificant(4)} ${trade.inputAmount.currency.symbol}` : '-'}
    //       </TYPE.black>
    //     </RowBetween>

    //     {amountBurn > 0 && (
    //       <RowBetween>
    //         <RowFixed>
    //           <TYPE.black fontSize={14} fontWeight={400} color={theme.red1}>
    //             Burn Token Amount
    //           </TYPE.black>
    //           <QuestionHelper text="This token will be burned when sold" />
    //         </RowFixed>
    //         <TYPE.black fontSize={14} color={theme.red1}>
    //           {realizedLPFee ? `${amountBurn} ${trade.inputAmount.currency.symbol}` : '-'}
    //         </TYPE.black>
    //       </RowBetween>
    //     )}
    //   </AutoColumn>
    // </>
    <Card padding={'0'}>
      <AutoColumn gap="2px">
        {Boolean(trade) && (
          <RowBetween align="center">
            <Text fontWeight={400} fontSize={12} color={theme.text2}>
              Price
            </Text>
            <TradePrice
              price={trade?.executionPrice}
              showInverted={showInverted}
              setShowInverted={setShowInverted}
            />
          </RowBetween>
        )}
        <RowBetween align="center">
          <ClickableText fontWeight={400} fontSize={12} color={theme.text2} onClick={toggleSettings}>
            Slippage Tolerance
          </ClickableText>
          <ClickableText fontWeight={400} fontSize={12} color={theme.text2} onClick={toggleSettings}>
            {allowedSlippage / 100}%
          </ClickableText>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <TYPE.black fontSize={12} fontWeight={400} color={theme.text2}>
              {trade?.tradeType === TradeType.EXACT_INPUT ? 'Minimum received' : 'Maximum sold'}
            </TYPE.black>
            {/* <QuestionHelper text="Your transaction will revert if there is a large, unfavorable price movement before it is confirmed." /> */}
          </RowFixed>
          <RowFixed>
            <TYPE.black fontSize={12}>
              {trade?.tradeType === TradeType.EXACT_INPUT
                ? slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4)
                : slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4)}
            </TYPE.black>
            <TYPE.black fontSize={12} marginLeft={'4px'}>
              {trade?.tradeType === TradeType.EXACT_INPUT
                ? trade?.outputAmount.currency.symbol ?? '-'
                : trade?.inputAmount.currency.symbol ?? '-'}
            </TYPE.black>
          </RowFixed>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <TYPE.black color={theme.text2} fontSize={12} fontWeight={400}>
              Price Impact
            </TYPE.black>
            {/* <QuestionHelper text="The difference between the market price and your price due to trade size." /> */}
          </RowFixed>
          <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <TYPE.black fontSize={12} fontWeight={400} color={theme.text2}>
              Liquidity Provider Fee
            </TYPE.black>
            {/* <QuestionHelper text="A portion of each trade (0.20%) goes to liquidity providers as a protocol incentive." /> */}
          </RowFixed>
          <TYPE.black fontSize={12}>
            {realizedLPFee ? realizedLPFee?.toSignificant(6) + ' ' + trade?.inputAmount.currency.symbol : '-'}
          </TYPE.black>
        </RowBetween>
      </AutoColumn>
    </Card>
  )
}

export interface AdvancedSwapDetailsProps {
  trade?: Trade
}

export function AdvancedSwapDetails({ trade }: AdvancedSwapDetailsProps) {
  const theme = useContext(ThemeContext)

  const [allowedSlippage] = useUserSlippageTolerance()

  const showRoute = Boolean(trade && trade.route.path.length > 2)

  return (
    <AutoColumn gap="md">
      {trade && (
        <>
          <TradeSummary trade={trade} allowedSlippage={allowedSlippage} />
          {showRoute && (
            <>
              <SectionBreak />
              <AutoColumn style={{ padding: '0 24px' }}>
                <RowFixed>
                  <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
                    Route
                  </TYPE.black>
                  <QuestionHelper text="Routing through these tokens resulted in the best price for your trade." />
                </RowFixed>
                <SwapRoute trade={trade} />
              </AutoColumn>
            </>
          )}
          {/*<AutoColumn style={{ padding: '0 24px' }}>
            <InfoLink href={'https://uniswap.info/pair/' + trade.route.pairs[0].liquidityToken.address} target="_blank">
              View pair analytics ↗
            </InfoLink>
          </AutoColumn>*/}
        </>
      )}
    </AutoColumn>
  )
}
