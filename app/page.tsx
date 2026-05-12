'use client';

import { useMemo, useState } from 'react';
import {
  Trophy,
  UserPlus,
  Trash2,
  Play,
  Users,
  History,
} from 'lucide-react';

interface Participant {
  id: string;
  name: string;
}

interface Winner {
  id: string;
  name: string;
  date: string;
}

export default function SorteioPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [name, setName] = useState('');
  const [winner, setWinner] = useState<string | null>(null);
  const [history, setHistory] = useState<Winner[]>([]);
  const [rolling, setRolling] = useState(false);
  const [highlighted, setHighlighted] = useState<string | null>(null);

  const totalParticipants = useMemo(
    () => participants.length,
    [participants]
  );

  const addParticipant = () => {
    if (!name.trim()) return;

    const newParticipant: Participant = {
      id: crypto.randomUUID(),
      name: name.trim(),
    };

    setParticipants((prev) => [...prev, newParticipant]);
    setName('');
  };

  const removeParticipant = (id: string) => {
    setParticipants((prev) => prev.filter((p) => p.id !== id));
  };

  const drawWinner = () => {
    if (participants.length === 0 || rolling) return;

    setWinner(null);
    setRolling(true);

    let count = 0;

    const animation = setInterval(() => {
      const random =
        participants[Math.floor(Math.random() * participants.length)];

      setHighlighted(random.name);

      count++;

      if (count > 20) {
        clearInterval(animation);

        const selected =
          participants[Math.floor(Math.random() * participants.length)];

        setHighlighted(selected.name);
        setWinner(selected.name);

        setHistory((prev) => [
          {
            id: crypto.randomUUID(),
            name: selected.name,
            date: new Date().toLocaleTimeString('pt-BR'),
          },
          ...prev,
        ]);

        setRolling(false);
      }
    }, 100);
  };

  return (
    <main className="min-h-screen bg-[#0f172a] text-white">
      <div className="grid lg:grid-cols-[340px_1fr] min-h-screen">
          <aside className="border-r border-white/10 bg-black/20 backdrop-blur-xl p-6 flex flex-col">
          <div className="mb-10">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-400 mb-2">
              Sistema
            </p>

            <h1 className="text-4xl font-black leading-none">
              Lucky
              <span className="text-cyan-400">Draw</span>
            </h1>
          </div>

          {/* INPUT */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <UserPlus className="w-5 h-5 text-cyan-400" />
              <h2 className="font-bold text-lg">Adicionar nomes</h2>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addParticipant()}
                placeholder="Ex: João"
                className="w-full bg-black/30 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-cyan-400 transition"
              />

              <button
                onClick={addParticipant}
                className="w-full py-3 rounded-2xl bg-cyan-400 text-slate-900 font-bold hover:scale-[1.02] active:scale-95 transition"
              >
                Adicionar participante
              </button>
            </div>
          </div>

          {/* PARTICIPANTS */}
          <div className="mt-6 flex-1 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" />
                <h2 className="font-bold">Participantes</h2>
              </div>

              <span className="text-sm text-cyan-400 font-semibold">
                {totalParticipants}
              </span>
            </div>

            <div className="space-y-2 overflow-y-auto max-h-[400px] pr-1">
              {participants.length === 0 ? (
                <div className="border border-dashed border-white/10 rounded-2xl p-6 text-center text-sm text-gray-400">
                  Nenhum participante ainda
                </div>
              ) : (
                participants.map((participant, index) => (
                  <div
                    key={participant.id}
                    className="group bg-white/5 border border-white/10 rounded-2xl px-4 py-3 flex items-center justify-between hover:bg-white/10 transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-cyan-400 text-slate-900 flex items-center justify-center text-sm font-black">
                        {index + 1}
                      </span>

                      <p>{participant.name}</p>
                    </div>

                    <button
                      onClick={() => removeParticipant(participant.id)}
                      className="opacity-0 group-hover:opacity-100 transition p-2 hover:bg-red-500/20 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>

        <section className="relative overflow-hidden flex flex-col items-center justify-center p-8">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-500/20 blur-3xl rounded-full" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/20 blur-3xl rounded-full" />
          </div>

          <div className="relative z-10 w-full max-w-4xl">
            <div className="text-center mb-12">
              <p className="uppercase tracking-[0.4em] text-cyan-400 text-sm mb-3">
                Sorteador interativo
              </p>

              <h2 className="text-6xl font-black leading-none mb-4">
                Quem será o
                <span className="block text-cyan-400">grande vencedor?</span>
              </h2>

              <p className="text-gray-400">
                Clique no botão abaixo para iniciar o sorteio.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[40px] p-10">
              <div className="flex flex-col items-center">
                <div
                  className={`w-full rounded-[30px] border transition-all duration-300 mb-8 p-12 text-center ${
                    rolling
                      ? 'border-cyan-400 shadow-[0_0_40px_rgba(34,211,238,0.4)]'
                      : 'border-white/10'
                  }`}
                >
                  <p className="text-sm uppercase tracking-[0.4em] text-gray-400 mb-4">
                    Resultado
                  </p>

                  <div className="min-h-[120px] flex items-center justify-center">
                    {highlighted ? (
                      <h3
                        className={`text-5xl font-black transition-all duration-200 ${
                          rolling
                            ? 'scale-110 text-cyan-300'
                            : 'scale-100 text-white'
                        }`}
                      >
                        {highlighted}
                      </h3>
                    ) : (
                      <p className="text-gray-500 text-xl">
                        Aguardando sorteio...
                      </p>
                    )}
                  </div>
                </div>

                {/* BUTTON */}
                <button
                  onClick={drawWinner}
                  disabled={participants.length === 0 || rolling}
                  className={`flex items-center gap-3 px-10 py-5 rounded-2xl text-lg font-black transition-all ${
                    participants.length === 0 || rolling
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-cyan-400 text-slate-900 hover:scale-105 active:scale-95'
                  }`}
                >
                  <Play className="w-5 h-5" />

                  {rolling ? 'SORTEANDO...' : 'INICIAR SORTEIO'}
                </button>

                {winner && !rolling && (
                  <div className="mt-10 w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 rounded-3xl p-8 text-center animate-pulse">
                    <div className="flex justify-center mb-4">
                      <Trophy className="w-12 h-12" />
                    </div>

                    <p className="uppercase text-sm font-bold tracking-[0.3em] mb-2">
                      vencedor
                    </p>

                    <h3 className="text-5xl font-black">{winner}</h3>
                  </div>
                )}
              </div>
            </div>

            {/* HISTORY */}
            <div className="mt-8 bg-white/5 border border-white/10 rounded-[30px] p-6">
              <div className="flex items-center gap-2 mb-5">
                <History className="w-5 h-5 text-cyan-400" />
                <h2 className="font-bold text-xl">Histórico</h2>
              </div>

              {history.length === 0 ? (
                <p className="text-gray-500">
                  Nenhum sorteio realizado ainda.
                </p>
              ) : (
                <div className="grid md:grid-cols-2 gap-3">
                  {history.map((item, index) => (
                    <div
                      key={item.id}
                      className="bg-black/20 border border-white/10 rounded-2xl p-4 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold">
                          #{index + 1} — {item.name}
                        </p>

                        <p className="text-sm text-gray-400">{item.date}</p>
                      </div>

                      <Trophy className="w-5 h-5 text-yellow-400" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}