import React from 'react';

const App = () => {
  return (
    <div id="app" className="display-contents">
      <Header />
      <Main />
      <SectionCompanies />
      <SectionDeploy />
      <SectionEverything />
    </div>
  );
};

const Header = () => (
  <div className="aje">
    <main>
      <div className="ab ec adn">
        <SvgPattern />
        <HeaderContent />
      </div>
    </main>
  </div>
);

const SvgPattern = () => (
  <svg aria-hidden="true" className="aa ak ed pn tu aqe bfe">
    <defs>
      <pattern
        x="50%"
        y="-1"
        id="983e3e4c-de6d-4c3f-8d64-b9761d1534cc"
        width="200"
        height="200"
        patternUnits="userSpaceOnUse"
      >
        <path d="M.5 200V.5H200" fill="none"></path>
      </pattern>
    </defs>
    <svg x="50%" y="-1" className="ado aow">
      <path
        d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
        strokeWidth="0"
      ></path>
    </svg>
    <rect
      fill="url(#983e3e4c-de6d-4c3f-8d64-b9761d1534cc)"
      width="100%"
      height="100%"
      strokeWidth="0"
    ></rect>
  </svg>
);

const HeaderContent = () => (
  <div className="gx uh arq asw auu clf dak dit dkz">
    <div className="gx uc uw cys dda dld">
      <img
        alt="Your Company"
        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
        className="no"
      />
      <div className="le cch czw">
        <a href="#" className="ly abs">
          <span className="adz ajv arl arv awg awm awv ayk bbz bcd bdc">
            Latest updates
          </span>
          <span className="ly zg abn awg awk awv axu">
            <span>Just shipped v1.0</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
              className="of si axx"
            >
              <path
                fillRule="evenodd"
                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                clipRule="evenodd"
              ></path>
            </svg>
          </span>
        </a>
      </div>
      <h1 className="kw avz awj axd ban cnc">Deploy to the cloud with confidence</h1>
      <p className="lk awf awx axu">
        Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat aliqua.
      </p>
      <div className="kw lx zg aap">
        <a href="#" className="aeb aju arm asc awg awm ban bbt bit bpb bpc bpe bpj">
          Get started
        </a>
        <a href="#" className="awg awm awv ban">
          Live demo <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
    <div className="gx la lx uc ccf czk czt czu dcy dde dny">
      <div className="ud uv cer dcy">
        <img
          alt="App screenshot"
          src="https://tailwindui.com/img/component-images/dark-project-app-screenshot.png"
          width="2432"
          height="1442"
          className="tm aeb alw bbp bbz bds"
        />
      </div>
    </div>
  </div>
);

const SectionCompanies = () => (
  <div className="gx lm uh arq ccc dit">
    <h2 className="avr awf awm awx ban">The world’s most innovative companies use our app</h2>
    <div className="gx kw mb uj yr zg aaq aas cey cfz cha cys dcy deg">
      <img alt="Transistor" src="https://tailwindui.com/img/logos/158x48/transistor-logo-white.svg" width="158" height="48" className="es pp tu aqj cxg" />
      <img alt="Reform" src="https://tailwindui.com/img/logos/158x48/reform-logo-white.svg" width="158" height="48" className="es pp tu aqj cxg" />
      <img alt="Tuple" src="https://tailwindui.com/img/logos/158x48/tuple-logo-white.svg" width="158" height="48" className="es pp tu aqj cxg" />
      <img alt="SavvyCal" src="https://tailwindui.com/img/logos/158x48/savvycal-logo-white.svg" width="158" height="48" className="es pp tu aqj bzp cxg" />
      <img alt="Statamic" src="https://tailwindui.com/img/logos/158x48/statamic-logo-white.svg" width="158" height="48" className="es ez pp tu aqj bzs cxg" />
    </div>
  </div>
);

const SectionDeploy = () => (
  <div className="gx lg uh arq ccm dit">
    <div className="gx uc avr">
      <h2 className="awe awm aww ayk">Deploy faster</h2>
      <p className="lb avy awj axd ban cna">Everything you need to deploy your app</p>
      <p className="lk awf awx axu">Lorem ipsum dolor sit amet consect adipisicing elit. Possimus magnam voluptatum cupiditate veritatis in accusamus quisquam.</p>
    </div>
    <div className="gx la uc cce czz dcy">
      <dl className="mb ur yn aaq aav dcy dee">
        <Feature title="Server monitoring" description="Non quo aperiam repellendus quas est est. Eos aut dolore aut ut sit nesciunt. Ex tempora quia. Sit nobis consequatur dolores incidunt." />
        <Feature title="Collaborate" description="Vero eum voluptatem aliquid nostrum voluptatem. Vitae esse natus. Earum nihil deserunt eos quasi cupiditate. A inventore et molestiae natus." />
        <Feature title="Task scheduling" description="Et quod quaerat dolorem quaerat architecto aliquam accusantium. Ex adipisci et doloremque autem quia quam. Quis eos molestiae at iure impedit." />
      </dl>
    </div>
  </div>
);

const Feature = ({ title, description }) => (
  <div className="lx yy">
    <dt className="awe awm aww ban">
      <div className="jk lx nn rq zg zl aea aju">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" className="oi sl ban">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      </div>
      {title}
    </dt>
    <dd className="ku lx uu yy awe aww axu">
      <p className="uu">{description}</p>
      <p className="lk"><a href="#" className="awg awm awv ayk">Learn more <span aria-hidden="true">→</span></a></p>
    </dd>
  </div>
);

const SectionEverything = () => (
  <div className='gx la uh arq ccm dit'> 
    Everything you need to deploy your app
    Deploy your app with confidence
    Lorem ipsum dolor sit amet consect adipisicing elit. Possimus magnam voluptatum cupiditate veritatis in accusamus quisquam.
  </div>
)

export default App;