import React from 'react';
import { Clock, CheckCircle2, XCircle, Star, Eye } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const norm = (status || 'pending').toLowerCase();

  switch (norm) {
    case 'approved':
    case 'accepted':
      return (
        <span className="badge badge-approved">
          <CheckCircle2 size={13} />
          {norm === 'accepted' ? 'Accepted' : 'Approved'}
        </span>
      );
    case 'rejected':
      return (
        <span className="badge badge-rejected">
          <XCircle size={13} />
          Rejected
        </span>
      );
    case 'shortlisted':
      return (
        <span className="badge badge-shortlisted">
          <Star size={13} />
          Shortlisted
        </span>
      );
    case 'reviewed':
      return (
        <span className="badge badge-reviewed">
          <Eye size={13} />
          Reviewed
        </span>
      );
    case 'pending':
    default:
      return (
        <span className="badge badge-pending">
          <Clock size={13} />
          Pending Review
        </span>
      );
  }
};

export default StatusBadge;
