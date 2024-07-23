export default function Summary() {
    return(
        <>
        <div className="text-card-foreground bg-card py-4 mt-16 md:mt-0 border-b border-border">

            <div className="border-b border-border pb-4">
                <h1 className="px-4 text-2xl">Resumo</h1>
            </div>

            <div className="flex flex-row px-8 pt-4 gap-4 lg:gap-48 md:gap-12 sm:gap-12 items-end justify-center w-full">
                <div className="flex flex-col text-left">
                    <label className="text-[10px] md:text-sm text-muted-foreground" htmlFor="">Período de Visualização</label>
                    <select name="data" id="" className="text-[10px] bg-card rounded-[--radius]">
                        <option className="" value="todos">Todos</option>
                    </select>
                </div>

                <div className="flex flex-col text-left">
                    <label className="text-[10px] md:text-sm text-muted-foreground" htmlFor="">Conta de Anúncio</label>
                    <select name="data" id="" className="text-[10px] bg-card rounded-[--radius]">
                        <option className="text-xs" value="todos">Todos</option>
                    </select>
                </div>

                <div className="flex flex-col text-left">
                    <label className="text-[10px] md:text-sm text-muted-foreground" htmlFor="">Plataforma</label>
                    <select name="data" id="" className="text-[10px] bg-card rounded-[--radius]">
                        <option className="text-xs" value="todos">Todos</option>
                    </select>
                </div>

                <div className="flex flex-col text-left">
                    <label className="text-[10px] md:text-sm text-muted-foreground" htmlFor="">Produto</label>
                    <select name="data" id="" className="text-[10px] bg-card rounded-[--radius] focus:ring focus:ring-ring">
                        <option className="text-xs" value="todos">Todos</option>
                    </select>
                </div>

              
            </div>
        </div>
        </>
    )
}
