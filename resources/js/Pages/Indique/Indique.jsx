import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { HeaderCampaign } from '@/Components/HeaderCampaign';
import { Button } from '@/Components/ui/button';


export default function Dashboard({ auth }) {
     return (
        <AuthenticatedLayout
            user={auth.user}           
        >
            <Head title="Indique e ganhe" />

            <div className="py-12 bg-background mt-4 md:mt-0">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 flex flex-col -ml-4 px-4 md:flex-row gap-4">
                    <div className="overflow-hidden shadow-sm sm:rounded-lg h-screen w-full flex flex-col gap-4">
                        <div className="text-card-foreground bg-card border border-border rounded-md">
                            <div className='px-6 py-3 border-b border-border'>
                                <h1>Link de divulgação</h1>
                            </div>

                            <div className='p-6'>
                                <p className='text-muted-foreground text-sm pb-6'>Link de indicação</p>
                                <input type="text" className='bg-card border border-border rounded-md w-full focus:ring-ring focus:border-ring' readOnly value={"https://localhost/?code=QOQGZKN4FQ"} />
                            </div>
                        </div>

                        <div className='w-full h-60 grid grid-cols-2 gap-4'>
                            <div className='rounded-md border border-border bg-card flex flex-col px-3 py-2 gap-2 justify-center'>

                                <h1>Cadastros ativos</h1>
                                <p className='font-bold text-lg'>0</p>

                            </div>
                            <div className='rounded-md border border-border bg-card flex flex-col px-3 py-2 gap-2 justify-center'>

                                <h1>Assinaturas ativas</h1>
                                <p className='font-bold text-lg'>0</p>

                            </div>
                            <div className='rounded-md border border-border bg-card flex flex-col px-3 py-2 gap-2 justify-center'>

                                <h1>Saldo a receber</h1>
                                <p className='font-bold text-lg'>R$ 0,00</p>
                            </div>
                            <div className='rounded-md border border-border bg-card flex flex-col px-3 py-2 gap-2 justify-center'>

                                <h1>Disponível para saque</h1>
                                <p className='font-bold text-lg'>R$ 0,00</p>

                            </div>
                        </div>

                        <div className='w-full bg-card h-40 border border-border rounded-md'>
                            <div className='p-6 border-b border-border'>
                                <h1>Solicitações de saque</h1>
                            </div>
                            <div className='px-6 pt-8'>
                                <Button>Solicitar Saque</Button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card overflow-hidden shadow-sm sm:rounded-lg border border-border w-full">
                        <div className='border-b border-border'>
                            <h1 className="p-6 text-card-foreground">Regulamento do indique e ganhe</h1>
                        </div>

                        <div className='text-muted-foreground text-sm p-6 flex flex-col gap-4'>
                            <p>Você pode gerar renda passiva indicando pessoas para a Utmize.</p>
                            <h1 className='text-card-foreground text-lg'>Como funciona a comissão?</h1>
                            <p>O nosso programa de indicações paga 10% de comissão durante 6 meses a partir da data de cadastro, sobre o valor de assinatura da conta que você indicou.</p>
                            <p>O valor de assinatura é o valor que o seu indicado paga mensalmente para utilizar a Utmize.</p>
                            <p>O indicado recebe 10% de desconto no primeiro mês, por usar o seu link de indicação.</p>
                            <p>Por exemplo, se o seu indicado assinou o plano de R$ 299,90 por mês, sua comissão será R$ 26,99 no primeiro mês e R$ 29,99 por mês durante os próximos 5 meses.

</p>
                            <p>Quanto mais você indicar, mais você ganha.</p>
                            <h1 className='text-card-foreground text-lg'>Como identificamos que você indicou uma conta?</h1>
                            <p>A identificação é feita através do seu link único de divulgação.</p>
                            <p>Apenas as contas que se cadastrarem através do seu link serão contabilizadas como seus indicados. Utilizamos o sistema de rastreio de primeiro clique, com duração de 30 dias.</p>
                            <div className='border border-red-500 rounded-sm p-6 bg-red-500/20'>
                                <p className='text-red-500 font-bold'>Você só pode indicar usuários novos, que nunca tenham se cadastrado na Utmize.</p>
                            </div>

                            <h1 className='text-card-foreground text-lg'>Como posso divulgar e promover a Utmize?</h1>
                            <p>Existem várias formas de ganhar dinheiro indicando a Utmize:</p>
                            <ul className='pl-8 list-disc'>
                                <li>Divulgar para seu público no Instagram</li>
                                <li>Vídeos no Youtube</li>
                                <li>Artigos em blogs</li>
                                <li>Recrutar os seus conhecidos que já vendem em outras plataformas</li>
                                <li>Marketing pago no Facebook</li>
                            </ul>
                            <p>Você pode criar landing pages sobre a Utmize também. Desde que fique claro que é uma página de depoimento / blog / review, e não uma página oficial da Utmize.</p>
                            <div className='border border-red-500 rounded-sm p-6 bg-red-500/20'>
                                <p className='text-red-500 font-bold'>Rodar anúncios no Google Search com a palavra chave "Utmize", ou criar perfis nas redes sociais com o nome da Utmize é totalmente proibido. Com risco de ter a conta bloqueada.</p>
                            </div>
                            <div className='border border-red-500 rounded-sm p-6 bg-red-500/20'>
                                <p className='text-red-500 font-bold'>É proibido indicar a si mesmo no programa de indicações.</p>
                            </div>

                            <h1 className='text-card-foreground text-lg'>Como funciona o saque do valor recebido?</h1>
                            <p>O valor mínimo para cada retirada é de R$ 50,00, tanto para CPF quanto CNPJ.</p>
                            <p>O valor máximo de retirada mensal para contas no CPF é de R$1.900,00. Não há limite para contas no CNPJ.</p>
                            <p>Então, se sua comissão ultrapassar esse valor mensal, será necessário sacar como CNPJ.</p>
                            <p>Em caso de retirada como PF, é descontado o valor de 20%, para cobrir questões tributárias obrigatórias. Ou seja, o valor recebido é apenas 80% do original.</p>
                            <p>O CPF ou CNPJ de saque não precisa estar cadastrado na Utmize. Ou seja, mesmo se você possui uma conta na Utmize registrada com CPF, você pode sacar para um CNPJ.</p>
                            <p>A escolha do saque como PF ou CNPJ é feito na hora da solicitação do saque.</p>

                            <div className='border border-red-500 rounded-sm p-6 bg-red-500/20'>
                                <p className='text-red-500 font-bold'>Não é possível selecionar o valor da retirada. Por ser uma comissão especial, a única forma disponível é sacando o valor total liberado.</p>
                            </div>

                            <p>As contas no CNPJ deverão emitir nota fiscal para receber o valor do programa de indicações.</p>
                            <p>Veja como funciona:</p>
                            <p>Após a solicitação de retirada do valor, nosso time enviará um e-mail com todos os dados necessários para a emissão da nota fiscal.</p>
                            <p>Após a emissão, basta enviar para o e-mail indicado e nós realizaremos o pagamento na chave pix do CNPJ incluído na hora da soliticação do saque, nos primeiros 5 dias úteis do próximo mês.</p>
                            <p>Caso o saque não seja efetuado no prazo, entre em contato conosco para verificar se houve algum problema no pagamento.</p>

                            <div className='border border-red-500 rounded-sm p-6 bg-red-500/20'>
                                <p className='text-red-500 font-bold'>Atualmente, o saque de comissões é feito apenas para contas bancárias no Brasil.</p>
                            </div>

                            <h1 className='text-card-foreground text-lg'>O que é saldo a receber?</h1>

                            <p>É o valor total de comissões geradas por suas indicações que ainda estão pendentes, ou seja, que ainda não foram liberadas para saque.</p>
                            <p>A liberação para saque ocorre 33 dias após o valor de comissão entrar em Saldo a receber.</p>

                            <h1 className='text-card-foreground text-lg'>Atividades de divulgação proibidas:</h1>
                            <p>Existem algumas práticas de divulgação que não são permitidas, e podem causar o bloqueio da sua conta.</p>
                            <p>O motivo é que essas práticas são prejudiciais à marca da Utmize, e causam confusão aos nossos clientes.</p>
                            <p>Veja abaixo a lista de atividades não permitidas:</p>
                            <ul className='pl-8 list-disc'>
                                <li>Criar páginas nas redes sociais usando o nome da Utmize</li>
                                <li>Fazer anúncios no Google Search usando a palavra chave "Utmize"</li>
                                <li>Criar um site se passando pela Utmize, ou dando a entender que é um site oficial da Utmize</li>
                                <li>Cookie-stuffing ou qualquer outra tentativa de burlar o sistema de rastreio</li>
                            </ul>

                            <div className='border border-red-500 rounded-sm p-6 bg-red-500/20'>
                                <p className='text-red-500 font-bold'>A Utmize reserva o direito de bloquear o programa de indicações para a sua conta a qualquer momento. Sem necessidade de prover uma explicação.</p>
                            </div>

                            <p>Além das atividades de divulgação proibidas, as situações abaixo também podem gerar o bloqueio:</p>
                            <ul className='pl-8 list-disc'>
                                <li>Suspeita de fraude</li>
                                <li>Indicações de baixa qualidade</li>
                                <li>Anúncios prejudiciais à marca Utmize</li>
                                <li>Ou qualquer outra situação que seja motivo de bloqueio.</li>
                            </ul>
                            <p>No caso de cancelamento do seu programa de indicações, você não receberá nenhuma comissão pendente.</p>
                            <h1 className='text-card-foreground text-lg'>Autoindicação</h1>
                            <p>É proibido indicar a si mesmo no programa de indicações.</p>
                        </div>
                    </div>
                </div>
            </div>  
        </AuthenticatedLayout>
    );
}
