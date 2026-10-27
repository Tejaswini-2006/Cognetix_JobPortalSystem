import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import JobCard from '../components/JobCard';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Search,
  MapPin,
  Briefcase,
  TrendingUp,
  ShieldCheck,
  Users,
  Building,
  CheckCircle2,
  ArrowRight,
  Code2,
  Palette,
  Megaphone,
  DollarSign,
  HeartPulse,
  Headphones,
} from 'lucide-react';

const CATEGORIES = [
  { name: 'Technology & IT', icon: Code2, count: '120+ Jobs' },
  { name: 'Design & Creative', icon: Palette, count: '45+ Jobs' },
  { name: 'Sales & Marketing', icon: Megaphone, count: '80+ Jobs' },
  { name: 'Finance & Accounting', icon: DollarSign, count: '60+ Jobs' },
  { name: 'Healthcare', icon: HeartPulse, count: '35+ Jobs' },
  { name: 'Customer Support', icon: Headphones, count: '50+ Jobs' },
];

const Home = () => {
  const navigate = useNavigate();
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeywords, setSearchKeywords] = useState('');
  const [searchLocation, setSearchLocation] = useState('');

  useEffect(() => {
    const fetchFeaturedJobs = async () => {
      try {
        const res = await api.get('/jobs?limit=6');
        if (res.data.success) {
          setFeaturedJobs(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load featured jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedJobs();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchKeywords) params.append('search', searchKeywords);
    if (searchLocation) params.append('location', searchLocation);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, var(--primary-navy) 0%, #162C4E 100%)',
          color: 'white',
          padding: '5rem 0 6rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle decorative glow */}
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            right: '-5%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(13, 148, 136, 0.25) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: '0.35rem 0.9rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--accent-teal-light)',
                marginBottom: '1.5rem',
                border: '1px solid rgba(255, 255, 255, 0.15)',
              }}
            >
              <ShieldCheck size={16} />
              <span>Verified Employers & Admin-Approved Opportunities</span>
            </div>

            <h1
              style={{
                color: 'white',
                fontSize: 'clamp(2.3rem, 5vw, 3.5rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                marginBottom: '1.25rem',
              }}
            >
              Discover Opportunities.{' '}
              <span
                style={{
                  background: 'linear-gradient(90deg, #2DD4BF, #38BDF8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Build Your Future.
              </span>
            </h1>

            <p
              style={{
                color: 'rgba(255, 255, 255, 0.85)',
                fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                lineHeight: 1.6,
                marginBottom: '2.5rem',
                maxWidth: '680px',
                margin: '0 auto 2.5rem',
              }}
            >
              CareerConnect bridges top talents and forward-thinking companies. Explore
              curated opportunities with transparent compensation, genuine employers, and
              streamlined PDF resume applications.
            </p>

            {/* Quick Search Bar */}
            <form
              onSubmit={handleHeroSearch}
              style={{
                backgroundColor: 'white',
                borderRadius: 'var(--radius-md)',
                padding: '0.6rem',
                boxShadow: 'var(--shadow-xl)',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  flex: '2 1 220px',
                  padding: '0.5rem 0.75rem',
                }}
              >
                <Search size={20} style={{ color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Job title, skills, or company..."
                  value={searchKeywords}
                  onChange={(e) => setSearchKeywords(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    fontSize: '0.95rem',
                    color: 'var(--text-main)',
                  }}
                />
              </div>

              <div
                style={{
                  width: '1px',
                  height: '32px',
                  backgroundColor: 'var(--border-light)',
                  display: 'none',
                }}
                className="desktop-divider"
              />

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  flex: '1.5 1 180px',
                  padding: '0.5rem 0.75rem',
                }}
              >
                <MapPin size={20} style={{ color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Location or 'Remote'..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    fontSize: '0.95rem',
                    color: 'var(--text-main)',
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  padding: '0.85rem 1.75rem',
                  fontSize: '1rem',
                  flex: '1 1 auto',
                }}
              >
                Search Jobs
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section style={{ padding: '4.5rem 0', backgroundColor: 'var(--bg-page)' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '2.5rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--accent-teal)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Verified Listings
              </span>
              <h2 style={{ fontSize: '2rem', marginTop: '0.25rem' }}>
                Featured Job Opportunities
              </h2>
            </div>
            <Link
              to="/jobs"
              className="btn btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              Browse All Jobs <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading featured positions..." />
          ) : featuredJobs.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {featuredJobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
              No active jobs available at the moment.
            </p>
          )}
        </div>
      </section>

      {/* Popular Categories */}
      <section style={{ padding: '4.5rem 0', backgroundColor: 'white' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3rem' }}>
            <span
              style={{
                fontSize: '0.85rem',
                color: 'var(--accent-teal)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Explore Fields
            </span>
            <h2 style={{ fontSize: '2rem', marginTop: '0.25rem' }}>
              Popular Job Categories
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              Discover career paths tailored to your specialized domain and industry skill set.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  to={`/jobs?category=${encodeURIComponent(cat.name)}`}
                  className="card"
                  style={{
                    textAlign: 'center',
                    padding: '1.75rem 1rem',
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    border: '1px solid var(--border-light)',
                  }}
                >
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--accent-teal-light)',
                      color: 'var(--accent-teal)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={24} />
                  </div>
                  <div>
                    <h4
                      style={{
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: 'var(--primary-navy)',
                      }}
                    >
                      {cat.name}
                    </h4>
                    <span
                      style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-muted)',
                        marginTop: '0.2rem',
                        display: 'block',
                      }}
                    >
                      {cat.count}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Platform Value Proposition */}
      <section style={{ padding: '4.5rem 0', backgroundColor: 'var(--bg-muted)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2.5rem',
              alignItems: 'center',
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--accent-teal)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Why Choose CareerConnect
              </span>
              <h2 style={{ fontSize: '2.25rem', marginTop: '0.35rem', marginBottom: '1.25rem' }}>
                Engineered for High-Trust Recruitment
              </h2>
              <p
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '1.05rem',
                  lineHeight: 1.6,
                  marginBottom: '1.75rem',
                }}
              >
                Unlike unmoderated job portals cluttered with spam and outdated listings,
                CareerConnect maintains strict standards for both candidates and employers.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <CheckCircle2
                    size={22}
                    style={{ color: 'var(--accent-teal)', flexShrink: 0, marginTop: '2px' }}
                  />
                  <div>
                    <strong style={{ color: 'var(--primary-navy)', fontSize: '1rem' }}>
                      Admin Moderation on Every Job
                    </strong>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      Every employer posting is reviewed by platform administrators before going live.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <CheckCircle2
                    size={22}
                    style={{ color: 'var(--accent-teal)', flexShrink: 0, marginTop: '2px' }}
                  />
                  <div>
                    <strong style={{ color: 'var(--primary-navy)', fontSize: '1rem' }}>
                      Secure PDF Resume Processing
                    </strong>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      Strict file validation, authenticated document streaming, and duplicate-application prevention.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <CheckCircle2
                    size={22}
                    style={{ color: 'var(--accent-teal)', flexShrink: 0, marginTop: '2px' }}
                  />
                  <div>
                    <strong style={{ color: 'var(--primary-navy)', fontSize: '1rem' }}>
                      Direct Application Tracking
                    </strong>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      Candidates receive real-time visibility into whether their application is reviewed, shortlisted, or accepted.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick CTA Box */}
            <div
              className="card"
              style={{
                backgroundColor: 'var(--primary-navy)',
                color: 'white',
                padding: '2.5rem',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-xl)',
              }}
            >
              <h3 style={{ color: 'white', fontSize: '1.6rem', marginBottom: '0.75rem' }}>
                Ready to take the next step?
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '2rem' }}>
                Join thousands of candidates finding their dream careers and companies hiring top
                engineering and creative talent today.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <Link to="/register" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                  Create Free Account
                </Link>
                <Link
                  to="/jobs"
                  className="btn btn-secondary btn-lg"
                  style={{
                    width: '100%',
                    backgroundColor: 'transparent',
                    color: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  }}
                >
                  Explore Current Openings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
