import tw, { css } from 'twin.macro'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { createMachine, assign } from 'xstate'
import { useMachine } from '@xstate/react'
import { ArrowIcon } from 'icons'

//Increase multiplier make more scroll length between the reveal of each line
const scrollMultiplier = 50

export default function Home() {
  const currentLineNumber = useCurrentLineNumber()

  return (
    <>
      <Head>
        <title>Jake's Parade</title>
        <meta charSet="utf-8"></meta>
        <meta name="description" content="A poem by Michael Dechane"></meta>
        <meta property="og:title" content="Jake's Parade" key="ogtitle"></meta>
        <meta
          property="og:description"
          content="A poem by Michael Dechane"
          key="ogdesc"
        />
        <meta
          property="og:image"
          content="https://lapsang-souchong.vercel.app/Tea_Meta.jpg"
          key="ogimage"
        ></meta>
        <meta name="twitter:card" content="summary_large_image"></meta>
      </Head>
      <Intro />
      <div
        css={[
          tw`flex justify-center my-0 mx-auto min-h-screen sticky top-0`,
          css`
            background-color: hsla(205deg, 10%, 13%, 1);
          `,
        ]}
      >
        <div tw="py-10 whitespace-nowrap">
          {stanzas.map((lines, stanzaIdx) => {
            const previousStanzas = stanzas.slice(0, stanzaIdx)
            const stanzaStartLine = previousStanzas.reduce(
              (totalLines, linesInStanza) => totalLines + linesInStanza.length,
              0
            )
            return (
              <Paragraph key={stanzaIdx}>
                {lines.map((line, lineIdx) => {
                  const lineNumber = stanzaStartLine + lineIdx
                  // events: 'SCROLL_ON' | 'SCROLL_PAST' | 'SCROLL_BEFORE'
                  const animationEvent =
                    currentLineNumber === lineNumber
                      ? 'SCROLL_ON'
                      : currentLineNumber > lineNumber
                      ? 'SCROLL_PAST'
                      : currentLineNumber < lineNumber
                      ? 'SCROLL_BEFORE'
                      : null

                  if (animationEvent === null) {
                    throw new Error("animationEvent can't be null")
                  }

                  return (
                    <Line
                      key={line}
                      animationEvent={animationEvent}
                      lastLine={lineNumber === lastLineNumber}
                    >
                      {line}
                    </Line>
                  )
                })}
              </Paragraph>
            )
          })}
        </div>
      </div>
      {/* The div that controls the scroll */}
      <div
        //invisible
        css={[
          tw`invisible w-screen min-h-screen bg-red-100`,
          css`
            height: ${100 * scrollMultiplier}vh;
          `,
        ]}
      ></div>
      <Outro />
    </>
  )
}

// Components

function Intro() {
  return (
    <div
      css={[
        tw`min-h-screen space-y-10`,
        css`
          background-color: hsla(205deg, 10%, 13%, 1);
          color: #fffbf9;
        `,
      ]}
    >
      <div tw="max-w-max mx-auto pt-44 space-y-6">
        <h1 tw="font-body font-bold text-6xl text-center">Jake’s Parade</h1>
        <h2 tw="font-body font-medium text-4xl text-center">
          a poem by Michael Dechane
        </h2>
      </div>
      <div tw="max-w-max mx-auto space-y-3">
        <p tw="font-body font-normal text-2xl text-center">scroll to begin</p>
        <ArrowIcon tw="w-4 h-6 fill-calico-orange-100 animate-bounce max-w-max mx-auto" />
      </div>
    </div>
  )
}

function Paragraph({ children }: { children: React.ReactNode }) {
  return (
    <p
      css={[
        tw`pb-4 absolute`,
        css`
          top: 60%;
          left: 40%;
        `,
      ]}
    >
      {children}
    </p>
  )
}

type AnimationEvent = 'SCROLL_ON' | 'SCROLL_PAST' | 'SCROLL_BEFORE'

// 'SCROLL_ON' | 'SCROLL_PAST' | 'SCROLL_BEFORE'
function Line({
  children,
  animationEvent,
  lastLine,
}: {
  children: React.ReactNode
  animationEvent: AnimationEvent
  lastLine: boolean
}) {
  const [state, send] = useMachine(
    animationMachine
    // lastLine
    //   ? {
    //       actions: {
    //         fromBeforeToOn: assign({
    //           animation:
    //             'from-before-to-on 3s forwards ease-out, from-on-to-past 5s 0.5s forwards ease-out',
    //         }),
    //       },
    //     }
    //   : {}
  )

  useEffect(() => {
    send(animationEvent)
  }, [send, animationEvent])

  return (
    <span
      css={[
        tw`block opacity-0 font-body font-medium absolute
        xs:font-normal text-xs xs:text-lg sm:text-xl md:text-xl lg:text-2xl`,
        css`
          animation: ${state.context.animation};
        `,
      ]}
    >
      {children}
    </span>
  )
}

function Outro() {
  //Change pt to flex and center that way
  return (
    <div
      css={[
        tw`min-h-screen sticky`,
        css`
          background-color: hsla(205deg, 10%, 13%, 0.95);
          color: #fffbf9;
        `,
      ]}
    >
      <p tw="text-center pt-64">read again</p>
    </div>
  )
}

// Data

const stanzas = [
  [
    'The best fire we had in those days was the night',
    "at Jake and Donna's place. It was bitter",
    'cold but we built the bonfire up high, then higher.',
    'Jake was a little drunk when he came laughing',
    'mostly falling down the stairs of the deck',
    'with the Papasan chair from their living room.',
    "Let's burn it, Jake roared, and we roared back",
    'with the flames when he threw it on and raised',
    'a three-story column of wild, perishing ash',
    'against the darkness still expanding',
    'between the flares of diminishing stars.',
    'I always hated that chair, Jake announced',
    'as we laughed with relish, in disbelief',
    'as Donna nodded, for once agreed.',
    'Everyone stood up and backed away a bit',
    'and in the multiplying heat, we began to see',
    "what he'd done, what he'd started. It turned out",
    'there were other things in the house Jake hated',
    'so he became his own parade and we the town',
    'that cheered him on. Letters he found and a half-',
    'finished painting. There were books that no longer',
    'worked for him, then the wobbly bookcase tumbled in.',
    'The more he found to burn, the better our fire',
    'seemed to like it and lick its quickening lips.',
    'There were things between most of us and inside',
    'every one of us alreading vanishing smoke.',
    'What I remember most is how our faces flickered',
    'in the shared, inexplicable goodness of that night',
    'and the guitar—how quick and soft the sound its strings',
    'made as they unmoored from the burning bridge.',
  ],
]

const lastLineNumber = stanzas.flat().length - 1

// Calculate the thresholds
const totalNumLines = stanzas.flat().length
const inc = 1 / (totalNumLines + 1)
const lineIdxArray = Array.from(Array(totalNumLines).keys())
const thresholds = lineIdxArray.map((id) => inc * (id + 1))

// Hooks/logic

function useCurrentLineNumber() {
  const [currentLineNumber, setCurrentLineNumber] = useState(-1)

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const { scrollY, innerHeight } = window

      const currentRatio = scrollY / (innerHeight * scrollMultiplier)
      const thresholdIdx = thresholds.findIndex(
        (threshold) => currentRatio <= threshold
      )
      const currentLineNumber =
        thresholdIdx === -1 ? lastLineNumber : thresholdIdx - 1
      setCurrentLineNumber(currentLineNumber)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return currentLineNumber
}

const animationMachine = createMachine(
  {
    context: {
      animation: '',
    },
    initial: 'beforeLine',
    states: {
      beforeLine: {
        on: {
          SCROLL_ON: {
            target: 'onLine',
            actions: 'fromBeforeToOn',
          },
        },
      },
      onLine: {},
      pastLine: {},
    },
    on: {
      SCROLL_PAST: {
        target: 'pastLine',
        actions: 'fromOnToPast',
      },
    },
  },
  {
    actions: {
      fromBeforeToOn: assign({
        animation: 'from-before-to-on 3s forwards ease-out',
      }),
      fromOnToPast: assign({
        animation:
          'from-on-to-past 5s forwards cubic-bezier(0.1, 0.7, 1.0, 0.1)',
      }),
    },
  }
)
