export default function SejaParceiro() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900">Cresça com o Lupa</h1>
        <p className="text-gray-500 mt-2 max-w-md mx-auto">
          Cadastre seu negócio e seja encontrado por milhares de pessoas em São José dos Campos
        </p>
      </div>

      {/* Benefícios */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          { icon: '📍', title: 'Visibilidade', desc: 'Seu negócio aparece para toda SJC' },
          { icon: '📢', title: 'Promoções', desc: 'Divulgue ofertas direto no app' },
          { icon: '💬', title: 'WhatsApp', desc: 'Clientes entram em contato direto' },
        ].map(b => (
          <div key={b.title} className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-100">
            <div className="text-3xl mb-2">{b.icon}</div>
            <h3 className="font-bold text-gray-900">{b.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{b.desc}</p>
          </div>
        ))}
      </div>

      {/* Planos */}
      <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">Planos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          {
            nome: 'Básico',
            preco: 'Grátis',
            features: ['Listagem no app', 'Informações básicas', 'Link WhatsApp'],
            destaque: false,
          },
          {
            nome: 'Premium',
            preco: 'R$ 49/mês',
            features: ['Tudo do Básico', 'Selo Premium', 'Posição destaque', 'Até 5 promoções', 'Estatísticas'],
            destaque: true,
          },
          {
            nome: 'Destaque',
            preco: 'R$ 99/mês',
            features: ['Tudo do Premium', 'Banner patrocinador', 'Destaque da Semana', 'Promoções ilimitadas', 'Suporte prioritário'],
            destaque: false,
          },
        ].map(plano => (
          <div
            key={plano.nome}
            className={`rounded-2xl p-5 border-2 ${
              plano.destaque
                ? 'border-primary-500 bg-primary-50 shadow-md relative'
                : 'border-gray-100 bg-white'
            }`}
          >
            {plano.destaque && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-primary-600 text-white text-xs font-bold rounded-full">
                Popular
              </span>
            )}
            <h3 className="font-bold text-lg text-gray-900">{plano.nome}</h3>
            <p className="text-2xl font-extrabold text-primary-600 mt-1">{plano.preco}</p>
            <ul className="mt-4 space-y-2">
              {plano.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-primary-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <a
              href={`https://wa.me/5512991234567?text=${encodeURIComponent(`Olá! Quero o plano ${plano.nome} do Lupa SJC`)}`}
              target="_blank"
              rel="noopener"
              className={`block mt-5 py-2.5 rounded-xl text-center font-bold text-sm transition ${
                plano.destaque
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Quero este plano
            </a>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center bg-gray-50 rounded-2xl p-6">
        <p className="text-gray-600">Dúvidas? Fale com a gente</p>
        <a
          href="https://wa.me/5512991234567?text=Oi!%20Quero%20saber%20mais%20sobre%20o%20Lupa%20SJC"
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-2 mt-3 px-6 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
          Falar no WhatsApp
        </a>
      </div>
    </div>
  )
}
