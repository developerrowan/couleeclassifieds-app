import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import HeroImage from '../assets/img/undraw_feeling_proud_qne1.svg';
import { setPageTitle } from '../services/auth.service';
import { getAllJobs, getDaysAgo } from '../services/job.service';

export default function Home() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState<any[] | undefined>(undefined);
  const [searchParams] = useSearchParams();

  const onSubmit = async (data: any) => {
    navigate(`/jobs?search=${encodeURIComponent(data.jobSearch)}`);
  };

  const getPayInformation = (job: any) => {
    return `$${parseFloat(job.jobPayRangeMin).toLocaleString('en-US')}${
      job.jobPayRangeMax ? ` - $${parseFloat(job.jobPayRangeMax).toLocaleString('en-US')}` : ''
    } / year`;
  };

  const getJobDescription = (job: any) => {
    const jobDescription = job.jobDescription;

    return `${
      jobDescription.length > 150 ? `${jobDescription.substring(0, 149)}...` : jobDescription
    }`;
  };

  useEffect(() => {
    setPageTitle('Home');

    async function getJobs() {
      getAllJobs(3).then((j) => {
        if (j) {
          setJobs(j);
        }
      });
    }

    getJobs();
  }, []);

  return (
    <>
      {searchParams.get('dangerMessage') && (
        <p className="text-danger text-center">
          {decodeURIComponent(searchParams.get('dangerMessage')!)}
        </p>
      )}
      <div className="container col-xxl-8 px-4 py-5">
        <div id="home-hero" className="row flex-lg-row-reverse align-items-center g-5 py-5">
          <div className="col-10 col-sm-8 col-lg-6">
            <img
              src={HeroImage}
              className="d-block mx-lg-auto img-fluid"
              alt="Bootstrap Themes"
              width="700"
              height="500"
              loading="lazy"
            />
          </div>
          <div className="col-lg-6">
            <h1 className="display-5 fw-bold lh-1 mb-3">Find your next career opportunity</h1>
            <p className="lead">
              Search for jobs near and far and find that next perfect opportunity you've been
              dreaming of.
            </p>
            <div className="d-grid gap-2 d-md-flex justify-content-md-start">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="container d-flex w-100"
                role="search"
              >
                <div className="form-floating me-md-2">
                  <input
                    className="form-control"
                    id="jobSearch"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                    {...register('jobSearch', { required: true, minLength: 3 })}
                  />
                  {errors.jobSearch && <p className="text-danger">Please enter a search query</p>}
                  <label htmlFor="jobSearch">Search</label>
                </div>
                <button className="btn btn-outline-success" type="submit">
                  Find Jobs
                </button>
              </form>
            </div>
          </div>
        </div>
        <hr />
        <h1 className="text-center">Latest Job Listings</h1>
        <div className="col-md-12">
          <div className="row">
            {!jobs ? (
              <div>Loading</div>
            ) : (
              <>
                {jobs.map((job, i) => {
                  const daysAgo = getDaysAgo(job.jobPostedDate);
                  return (
                    <div className="col-md-4" key={i}>
                      <div className="card">
                        <div className="card-body">
                          <h5 className="card-title">Title</h5>
                          <p className="card-text">{getJobDescription(job)}</p>
                          <a href="#" className="btn btn-primary">
                            View
                          </a>
                        </div>
                        <div className="card-footer text-muted">
                          {daysAgo >= 30 ? '30+' : daysAgo} days ago | {getPayInformation(job)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
