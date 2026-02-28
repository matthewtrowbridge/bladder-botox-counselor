import PrivacyNotice from './PrivacyNotice';

export default function WelcomeScreen({ onSelectRole }) {
  return (
    <main className="flex-1 overflow-y-auto">
      <div className="max-w-md w-full mx-auto px-6 py-8 space-y-6 flex flex-col justify-center min-h-full">
        <div className="text-center">
          <span className="text-4xl block mb-3" aria-hidden="true">🌿</span>
          <h2 className="text-xl sm:text-2xl font-semibold text-warmgray mb-2">
            Welcome to Your Bladder Health Guide
          </h2>
          <p className="text-gray-600 leading-relaxed" style={{ fontSize: 'var(--chat-font-size, 17px)' }}>
            Learn about a bladder treatment at your own pace. Ask any questions
            you have — there's no rush.
          </p>
        </div>

        <div className="space-y-3" role="group" aria-label="Choose your role">
          <button
            onClick={() => onSelectRole('patient')}
            className="w-full py-4 px-6 bg-teal text-white rounded-xl text-lg font-medium hover:bg-teal-dark transition-colors focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2"
          >
            I'm the patient
          </button>
          <button
            onClick={() => onSelectRole('caregiver')}
            className="w-full py-4 px-6 bg-white text-teal border-2 border-teal rounded-xl text-lg font-medium hover:bg-teal hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2"
          >
            I'm helping someone learn about this
          </button>
        </div>

        <aside className="space-y-2 text-center">
          <PrivacyNotice />
          <p className="text-xs text-gray-400">
            Prefiero español <span className="text-gray-300">(coming soon)</span>
          </p>
        </aside>
      </div>
    </main>
  );
}
