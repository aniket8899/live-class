import React from 'react';
import { FaUsers } from 'react-icons/fa';
import { APP_CONFIG } from '../../utils.js/constants';

const ParticipantsList = ({ participants = [], hostName }) => {
  if (!participants || participants.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 sticky top-4">
        <div className="flex items-center mb-4">
          <FaUsers className="w-5 h-5 mr-2 text-indigo-600" />
          <h2 className="text-xl font-bold text-gray-900">
            {APP_CONFIG.SESSION_CONTENT.PARTICIPANTS.HEADING}
          </h2>
        </div>

        <div className="text-center py-4">
          <p className="text-sm text-gray-500">
            {APP_CONFIG.SESSION_CONTENT.PARTICIPANTS.EMPTY_MESSAGE}
          </p>
        </div>
      </div>
    );
  }

  const hostParticipants = participants.filter(
    (p) => p.userName === hostName
  );

  const otherParticipants = participants.filter(
    (p) => p.userName !== hostName
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 sticky top-4">
      <div className="flex items-center mb-4">
        <FaUsers className="w-5 h-5 mr-2 text-indigo-600" />
        <h2 className="text-xl font-bold text-gray-900">
          {APP_CONFIG.SESSION_CONTENT.PARTICIPANTS.HEADING} (
          {participants.length})
        </h2>
      </div>

      <div className="space-y-4">
        {/* Host Section */}
        {hostParticipants.map((p) => (
          <div
            key={p._id || p.id || p.userName}
            className="p-3 bg-indigo-50 rounded-lg border border-indigo-100 flex items-center"
          >
            <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center mr-3 text-white font-semibold">
              {p.userName?.charAt(0)?.toUpperCase()}
            </div>

            <div>
              <p className="font-semibold text-gray-900">
                {p.userName}
              </p>

              <p className="text-sm text-blue-600 font-medium">
                {APP_CONFIG.SESSION_CONTENT.PARTICIPANTS.HOST_LABEL}
              </p>
            </div>
          </div>
        ))}

        {/* Participants Section */}
        {otherParticipants.length > 0 && (
          <div className="pt-3 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-3">
              {APP_CONFIG.SESSION_CONTENT.PARTICIPANTS.JOINED_USERS_LABEL}
            </p>

            <div className="space-y-3">
              {otherParticipants.map((p) => (
                <div
                  key={p._id || p.id || p.userName}
                  className="p-3 bg-white rounded-lg border border-gray-200 flex items-center"
                >
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-3 text-gray-700 font-semibold">
                    {p.userName?.charAt(0)?.toUpperCase()}
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900">
                      {p.userName}
                    </p>

                    <p className="text-sm text-gray-500">
                      {APP_CONFIG.SESSION_CONTENT.PARTICIPANTS.PARTICIPANT_LABEL}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticipantsList;