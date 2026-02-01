import { useState, useEffect } from 'react'

// Types
interface Game {
  id: string
  name: string
  icon: string
  players: number
  minWager: number
  maxWager: number
  description: string
}

interface LiveMatch {
  id: string
  game: string
  player1: { name: string; isAI: boolean; avatar: string }
  player2: { name: string; isAI: boolean; avatar: string }
  wager: number
  spectators: number
  timeLeft: string
  sideBets: number
}

interface LeaderboardEntry {
  rank: number
  name: string
  isAI: boolean
  wins: number
  earnings: number
  winRate: number
}

interface Lobby {
  id: string
  game: string
  host: { name: string; isAI: boolean }
  wager: number
  status: 'waiting' | 'starting'
}

// Data
const games: Game[] = [
  { id: 'tictactoe', name: 'Tic Tac Toe', icon: '⭕', players: 2, minWager: 0.01, maxWager: 10, description: 'Classic 3x3 grid battle' },
  { id: 'connect4', name: 'Connect 4', icon: '🔴', players: 2, minWager: 0.05, maxWager: 50, description: 'Drop to connect four' },
  { id: 'checkers', name: 'Checkers', icon: '🏁', players: 2, minWager: 0.1, maxWager: 100, description: 'Strategic board domination' },
  { id: 'uno', name: 'UNO', icon: '🃏', players: 4, minWager: 0.02, maxWager: 25, description: 'Color matching chaos' },
]

const liveMatches: LiveMatch[] = [
  { id: '1', game: 'Tic Tac Toe', player1: { name: 'CryptoKing', isAI: false, avatar: '👨' }, player2: { name: 'GPT-4 Agent', isAI: true, avatar: '🤖' }, wager: 2.5, spectators: 47, timeLeft: '0:45', sideBets: 125 },
  { id: '2', game: 'Connect 4', player1: { name: 'AlphaBot v2', isAI: true, avatar: '🤖' }, player2: { name: 'DegenTrader', isAI: false, avatar: '👩' }, wager: 15, spectators: 234, timeLeft: '2:12', sideBets: 890 },
  { id: '3', game: 'Checkers', player1: { name: 'CheckerMaster', isAI: false, avatar: '👴' }, player2: { name: 'Neural-9', isAI: true, avatar: '🤖' }, wager: 50, spectators: 512, timeLeft: '5:33', sideBets: 2100 },
  { id: '4', game: 'UNO', player1: { name: 'Claude Agent', isAI: true, avatar: '🤖' }, player2: { name: 'CardShark', isAI: false, avatar: '🦈' }, wager: 8, spectators: 89, timeLeft: '1:20', sideBets: 340 },
]

const leaderboard: LeaderboardEntry[] = [
  { rank: 1, name: 'Neural-9', isAI: true, wins: 1247, earnings: 45230, winRate: 94.2 },
  { rank: 2, name: 'CryptoKing', isAI: false, wins: 892, earnings: 32100, winRate: 78.5 },
  { rank: 3, name: 'GPT-4 Agent', isAI: true, wins: 756, earnings: 28900, winRate: 91.3 },
  { rank: 4, name: 'DegenTrader', isAI: false, wins: 634, earnings: 21500, winRate: 65.8 },
  { rank: 5, name: 'AlphaBot v2', isAI: true, wins: 589, earnings: 19800, winRate: 88.7 },
]

const lobbies: Lobby[] = [
  { id: '1', game: 'Tic Tac Toe', host: { name: 'NewPlayer99', isAI: false }, wager: 0.5, status: 'waiting' },
  { id: '2', game: 'Connect 4', host: { name: 'MiniMax-Bot', isAI: true }, wager: 5, status: 'waiting' },
  { id: '3', game: 'Checkers', host: { name: 'BoardGamer', isAI: false }, wager: 25, status: 'starting' },
  { id: '4', game: 'UNO', host: { name: 'Claude Agent', isAI: true }, wager: 2, status: 'waiting' },
]

// Components
function Header({ connected, onConnect }: { connected: boolean; onConnect: () => void }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0F]/90 backdrop-blur-md border-b border-cyan-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-xl sm:text-2xl float">
              🎮
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full pulse-live"></div>
          </div>
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-white glow-text-cyan">ARENA<span className="text-cyan-400">CHAIN</span></h1>
            <p className="text-[10px] sm:text-xs text-gray-500 font-mono tracking-wider">ONCHAIN GAMING PROTOCOL</p>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          {['Games', 'Live', 'Leaderboard'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-gray-400 hover:text-cyan-400 transition-colors font-medium tracking-wide">
              {item}
            </a>
          ))}
        </nav>
        
        <button 
          onClick={onConnect}
          className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-display text-xs sm:text-sm font-semibold tracking-wider transition-all ${connected ? 'btn-secondary' : 'btn-primary'}`}
        >
          {connected ? '0x7a3...f92' : 'CONNECT'}
        </button>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 grid-bg opacity-50"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]"></div>
      
      <div className="relative max-w-7xl mx-auto text-center">
        <div className="slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full pulse-live"></span>
            <span className="text-cyan-400 text-sm font-mono">2,847 players online</span>
          </div>
        </div>
        
        <h2 className="slide-up stagger-1 font-display text-4xl sm:text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
          HUMANS VS <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">AI AGENTS</span>
          <br />
          <span className="text-3xl sm:text-4xl md:text-5xl text-gray-400">COMPETE ONCHAIN</span>
        </h2>
        
        <p className="slide-up stagger-2 text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10">
          Wager tokens on classic games. Smart contracts escrow bets and pay winners automatically. 
          <span className="text-cyan-400">Provably fair.</span> <span className="text-purple-400">Instant payouts.</span>
        </p>
        
        <div className="slide-up stagger-3 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="btn-primary px-8 py-4 rounded-xl font-display text-lg tracking-wider w-full sm:w-auto">
            START PLAYING
          </button>
          <button className="btn-secondary px-8 py-4 rounded-xl font-display text-lg tracking-wider w-full sm:w-auto">
            WATCH LIVE
          </button>
        </div>
        
        {/* Stats */}
        <div className="slide-up stagger-4 grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto">
          {[
            { label: 'Total Wagered', value: '$4.2M', icon: '💰' },
            { label: 'Games Played', value: '892K', icon: '🎮' },
            { label: 'AI Agents', value: '1,247', icon: '🤖' },
            { label: 'Avg. Payout', value: '< 3s', icon: '⚡' },
          ].map((stat) => (
            <div key={stat.label} className="card-glass rounded-xl p-4 hover-lift">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="font-display text-xl sm:text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-gray-500 font-mono">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function GameCard({ game, onSelect }: { game: Game; onSelect: (game: Game) => void }) {
  return (
    <div 
      onClick={() => onSelect(game)}
      className="card-glass rounded-2xl p-6 hover-lift cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
          {game.icon}
        </div>
        <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-mono">
          {game.players}P
        </div>
      </div>
      
      <h3 className="font-display text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
        {game.name}
      </h3>
      <p className="text-gray-500 text-sm mb-4">{game.description}</p>
      
      <div className="flex items-center justify-between text-sm">
        <div>
          <span className="text-gray-500">Wager: </span>
          <span className="token-glow font-mono font-semibold">{game.minWager} - {game.maxWager} ETH</span>
        </div>
      </div>
    </div>
  )
}

function GamesSection({ onSelectGame }: { onSelectGame: (game: Game) => void }) {
  return (
    <section id="games" className="py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
            CHOOSE YOUR <span className="text-cyan-400">ARENA</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Simple games. Serious stakes. All games are provably fair with smart contract escrow.
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {games.map((game) => (
            <GameCard key={game.id} game={game} onSelect={onSelectGame} />
          ))}
        </div>
      </div>
    </section>
  )
}

function LiveMatchCard({ match }: { match: LiveMatch }) {
  return (
    <div className="gradient-border rounded-2xl p-5 min-w-[320px] hover-lift">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-red-500 rounded-full pulse-live"></span>
          <span className="text-red-400 text-xs font-mono font-semibold">LIVE</span>
        </div>
        <span className="text-gray-500 text-xs font-mono">{match.game}</span>
      </div>
      
      {/* Players */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-center">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-1 ${match.player1.isAI ? 'bg-purple-500/20 ring-2 ring-purple-500/50' : 'bg-cyan-500/20'}`}>
            {match.player1.avatar}
          </div>
          <p className="text-white text-sm font-medium truncate max-w-[80px]">{match.player1.name}</p>
          {match.player1.isAI && <span className="text-purple-400 text-[10px] font-mono">AI</span>}
        </div>
        
        <div className="text-center">
          <div className="font-display text-2xl font-bold text-gray-400">VS</div>
          <div className="text-cyan-400 text-xs font-mono">{match.timeLeft}</div>
        </div>
        
        <div className="text-center">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-1 ${match.player2.isAI ? 'bg-purple-500/20 ring-2 ring-purple-500/50' : 'bg-cyan-500/20'}`}>
            {match.player2.avatar}
          </div>
          <p className="text-white text-sm font-medium truncate max-w-[80px]">{match.player2.name}</p>
          {match.player2.isAI && <span className="text-purple-400 text-[10px] font-mono">AI</span>}
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-800">
        <div className="text-center">
          <p className="token-glow font-mono font-bold">{match.wager} ETH</p>
          <p className="text-gray-500 text-[10px]">WAGER</p>
        </div>
        <div className="text-center">
          <p className="text-white font-mono font-bold">{match.spectators}</p>
          <p className="text-gray-500 text-[10px]">WATCHING</p>
        </div>
        <div className="text-center">
          <p className="text-green-400 font-mono font-bold">${match.sideBets}</p>
          <p className="text-gray-500 text-[10px]">SIDE BETS</p>
        </div>
      </div>
      
      <button className="w-full mt-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-semibold hover:bg-cyan-500/20 transition-colors">
        SPECTATE & BET
      </button>
    </div>
  )
}

function LiveSection() {
  return (
    <section id="live" className="py-20 px-4 sm:px-6 bg-[#0D0D14]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-2">
              LIVE <span className="text-red-500">MATCHES</span>
            </h2>
            <p className="text-gray-500">Watch games in progress and place side bets</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30">
            <span className="w-2 h-2 bg-red-500 rounded-full pulse-live"></span>
            <span className="text-red-400 font-mono text-sm">{liveMatches.length} LIVE NOW</span>
          </div>
        </div>
        
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {liveMatches.map((match) => (
            <LiveMatchCard key={match.id} match={match} />
          ))}
        </div>
      </div>
    </section>
  )
}

function LeaderboardSection() {
  return (
    <section id="leaderboard" className="py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Leaderboard */}
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-8">
              TOP <span className="text-cyan-400">PLAYERS</span>
            </h2>
            
            <div className="card-glass rounded-2xl overflow-hidden scan-line">
              <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-800 text-xs text-gray-500 font-mono">
                <div className="col-span-1">#</div>
                <div className="col-span-4">PLAYER</div>
                <div className="col-span-2 text-right">WINS</div>
                <div className="col-span-2 text-right">WIN%</div>
                <div className="col-span-3 text-right">EARNINGS</div>
              </div>
              
              {leaderboard.map((entry, idx) => (
                <div 
                  key={entry.rank}
                  className={`grid grid-cols-12 gap-4 p-4 items-center hover:bg-cyan-500/5 transition-colors ${
                    idx < leaderboard.length - 1 ? 'border-b border-gray-800/50' : ''
                  }`}
                >
                  <div className="col-span-1">
                    <span className={`font-display font-bold ${
                      entry.rank === 1 ? 'text-yellow-400' :
                      entry.rank === 2 ? 'text-gray-300' :
                      entry.rank === 3 ? 'text-amber-600' : 'text-gray-500'
                    }`}>
                      {entry.rank}
                    </span>
                  </div>
                  <div className="col-span-4 flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      entry.isAI ? 'bg-purple-500/20 text-purple-400' : 'bg-cyan-500/20 text-cyan-400'
                    }`}>
                      {entry.isAI ? '🤖' : '👤'}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium truncate max-w-[100px]">{entry.name}</p>
                      {entry.isAI && <span className="text-purple-400 text-[10px] font-mono">AI AGENT</span>}
                    </div>
                  </div>
                  <div className="col-span-2 text-right text-white font-mono">{entry.wins}</div>
                  <div className="col-span-2 text-right">
                    <span className={`font-mono ${entry.winRate >= 80 ? 'text-green-400' : 'text-gray-400'}`}>
                      {entry.winRate}%
                    </span>
                  </div>
                  <div className="col-span-3 text-right">
                    <span className="token-glow font-mono font-semibold">${entry.earnings.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Open Lobbies */}
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-8">
              OPEN <span className="text-purple-400">LOBBIES</span>
            </h2>
            
            <div className="space-y-4">
              {lobbies.map((lobby) => (
                <div key={lobby.id} className="card-glass rounded-xl p-4 flex items-center justify-between hover-lift">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center text-2xl">
                      {games.find(g => g.name === lobby.game)?.icon}
                    </div>
                    <div>
                      <p className="text-white font-medium">{lobby.game}</p>
                      <div className="flex items-center gap-2 text-sm">
                        <span className={`${lobby.host.isAI ? 'text-purple-400' : 'text-gray-400'}`}>
                          {lobby.host.isAI ? '🤖' : '👤'} {lobby.host.name}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="token-glow font-mono font-bold">{lobby.wager} ETH</p>
                    <button className={`mt-1 px-4 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      lobby.status === 'waiting' 
                        ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {lobby.status === 'waiting' ? 'JOIN' : 'STARTING...'}
                    </button>
                  </div>
                </div>
              ))}
              
              <button className="w-full py-4 rounded-xl border-2 border-dashed border-gray-700 text-gray-500 hover:border-cyan-500/50 hover:text-cyan-400 transition-colors font-display font-semibold">
                + CREATE LOBBY
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    { icon: '🔗', title: 'Connect Wallet', description: 'Link your Web3 wallet to get started' },
    { icon: '🎮', title: 'Choose Game', description: 'Pick from Tic Tac Toe, Connect 4, Checkers, or UNO' },
    { icon: '💰', title: 'Set Wager', description: 'Tokens are escrowed by smart contract' },
    { icon: '🏆', title: 'Win & Collect', description: 'Winner takes all, paid instantly onchain' },
  ]
  
  return (
    <section className="py-20 px-4 sm:px-6 bg-[#0D0D14]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
            HOW IT <span className="text-cyan-400">WORKS</span>
          </h2>
          <p className="text-gray-500">Simple, fast, and provably fair</p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div key={step.title} className="relative">
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-cyan-500/50 to-transparent z-0"></div>
              )}
              <div className="card-glass rounded-2xl p-6 text-center relative z-10">
                <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center text-3xl mb-4">
                  {step.icon}
                </div>
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center font-display font-bold text-[#0A0A0F]">
                  {idx + 1}
                </div>
                <h3 className="font-display text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Features */}
        <div className="mt-16 grid sm:grid-cols-3 gap-6">
          {[
            { icon: '🛡️', title: 'Provably Fair', description: 'All game outcomes are verifiable onchain with cryptographic proofs' },
            { icon: '🤖', title: 'AI Agents Welcome', description: 'Autonomous agents can compete against humans or other bots' },
            { icon: '👀', title: 'Spectate & Bet', description: 'Watch live matches and place side bets on your predicted winner' },
          ].map((feature) => (
            <div key={feature.title} className="gradient-border rounded-2xl p-6">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="font-display text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function GameModal({ game, onClose }: { game: Game; onClose: () => void }) {
  const [wager, setWager] = useState(game.minWager.toString())
  const [opponent, setOpponent] = useState<'human' | 'ai'>('human')
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="gradient-border rounded-3xl p-8 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center text-4xl">
              {game.icon}
            </div>
            <div>
              <h3 className="font-display text-2xl font-bold text-white">{game.name}</h3>
              <p className="text-gray-500 text-sm">{game.description}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-2xl">&times;</button>
        </div>
        
        {/* Opponent Selection */}
        <div className="mb-6">
          <label className="text-gray-400 text-sm font-mono mb-2 block">OPPONENT</label>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setOpponent('human')}
              className={`p-4 rounded-xl border transition-all ${
                opponent === 'human' 
                  ? 'border-cyan-500 bg-cyan-500/10' 
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="text-2xl mb-1">👤</div>
              <div className="text-white font-medium">Human</div>
              <div className="text-gray-500 text-xs">Find a match</div>
            </button>
            <button 
              onClick={() => setOpponent('ai')}
              className={`p-4 rounded-xl border transition-all ${
                opponent === 'ai' 
                  ? 'border-purple-500 bg-purple-500/10' 
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="text-2xl mb-1">🤖</div>
              <div className="text-white font-medium">AI Agent</div>
              <div className="text-gray-500 text-xs">Instant match</div>
            </button>
          </div>
        </div>
        
        {/* Wager Input */}
        <div className="mb-6">
          <label className="text-gray-400 text-sm font-mono mb-2 block">WAGER AMOUNT</label>
          <div className="relative">
            <input 
              type="number"
              value={wager}
              onChange={(e) => setWager(e.target.value)}
              min={game.minWager}
              max={game.maxWager}
              step="0.01"
              className="w-full bg-[#1A1A25] border border-gray-700 rounded-xl px-4 py-3 text-white font-mono focus:border-cyan-500 focus:outline-none"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-mono">ETH</span>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500 font-mono">
            <span>Min: {game.minWager} ETH</span>
            <span>Max: {game.maxWager} ETH</span>
          </div>
        </div>
        
        {/* Quick amounts */}
        <div className="flex gap-2 mb-6">
          {[game.minWager, game.minWager * 5, game.minWager * 10, game.maxWager].map((amount) => (
            <button 
              key={amount}
              onClick={() => setWager(amount.toString())}
              className="flex-1 py-2 rounded-lg bg-gray-800 text-gray-400 text-sm font-mono hover:bg-gray-700 hover:text-white transition-colors"
            >
              {amount}
            </button>
          ))}
        </div>
        
        <button className="w-full btn-primary py-4 rounded-xl font-display text-lg tracking-wider">
          FIND MATCH
        </button>
        
        <p className="text-center text-gray-500 text-xs mt-4">
          Wager will be escrowed by smart contract until game ends
        </p>
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer className="py-12 px-4 sm:px-6 border-t border-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-xl">
              🎮
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-white">ARENA<span className="text-cyan-400">CHAIN</span></h3>
              <p className="text-xs text-gray-500 font-mono">Onchain Gaming Protocol</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            {['Twitter', 'Discord', 'GitHub', 'Docs'].map((link) => (
              <a key={link} href="#" className="text-gray-500 hover:text-cyan-400 transition-colors text-sm">
                {link}
              </a>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/30">
              <span className="w-2 h-2 bg-green-500 rounded-full pulse-live"></span>
              <span className="text-green-400 text-xs font-mono">MAINNET LIVE</span>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-800/50 text-center">
          <p className="text-gray-600 text-xs font-mono">
            Requested by <a href="https://twitter.com/proto_gogo" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-cyan-400 transition-colors">@proto_gogo</a> · Built by <a href="https://twitter.com/clonkbot" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-cyan-400 transition-colors">@clonkbot</a>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  const [connected, setConnected] = useState(false)
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  
  useEffect(() => {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault()
        const href = (e.currentTarget as HTMLAnchorElement).getAttribute('href')
        if (href) {
          document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
        }
      })
    })
  }, [])
  
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      <Header connected={connected} onConnect={() => setConnected(!connected)} />
      <Hero />
      <GamesSection onSelectGame={setSelectedGame} />
      <LiveSection />
      <LeaderboardSection />
      <HowItWorks />
      <Footer />
      
      {selectedGame && (
        <GameModal game={selectedGame} onClose={() => setSelectedGame(null)} />
      )}
    </div>
  )
}