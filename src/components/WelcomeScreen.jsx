import PrivacyNotice from './PrivacyNotice';

export default function WelcomeScreen({ onSelectRole }) {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-md w-full text-center space-y-8">
        <div>
          <span className="text-5xl block mb-4" aria-hidden="true">🌿</span>
          <h2 className="text-2xl font-semibold text-warmgray mb-3">
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

        <aside className="pt-2 space-y-3">
          <PrivacyNotice />
          <p className="text-xs text-gray-400 text-center">
            Prefiero español <span className="text-gray-300">(coming soon)</span>
          </p>
        </aside>
      </div>
    </main>
  );
}
