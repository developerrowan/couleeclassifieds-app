import { useEffect } from 'react';
import { setPageTitle } from '../services/auth.service';

export default function Jobs() {
  useEffect(() => {
    setPageTitle('Jobs');
  }, []);

  return (
    <div className="container col-xxl-8 px-4 py-5">
      <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
        <form className="row g-3">
          <div className="col-md-6">
            <label htmlFor="inputEmail4" className="form-label">
              Query
            </label>
            <input type="email" className="form-control" id="inputEmail4" />
          </div>
          <div className="col-md-2">
            <label htmlFor="inputPassword4" className="form-label">
              ZIP
            </label>
            <input type="password" className="form-control" id="inputPassword4" />
          </div>
          <div className="col-md-4">
            <input className="btn btn-primary" type="button" value="Submit" />
          </div>
          <div className="col-md-10">
            <div className="accordion accordion-flush" id="accordionFlushExample">
              <div className="accordion-item">
                <h2 className="accordion-header" id="flush-headingOne">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseOne"
                    aria-expanded="false"
                    aria-controls="flush-collapseOne"
                  >
                    Advanced
                  </button>
                </h2>
                <div
                  id="flush-collapseOne"
                  className="accordion-collapse collapse"
                  aria-labelledby="flush-headingOne"
                  data-bs-parent="#accordionFlushExample"
                >
                  <div className="row">
                    <div className="col-md-6">
                      <label htmlFor="customRange1" className="form-label">
                        Minimum pay
                      </label>
                      <input type="range" className="form-range" id="customRange1" />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="customRange1" className="form-label">
                        Maximum pay
                      </label>
                      <input type="range" className="form-range" id="customRange1" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-2"></div>
        </form>
      </div>
    </div>
  );
}
