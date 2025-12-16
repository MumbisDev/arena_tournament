import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { Layout, Breadcrumbs } from '../components/layout';
import { Button } from '../components/ui/Button';
import { Input, Textarea, Select } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { StatusBadge } from '../components/ui/Badge';
import { useAuthStore } from '../store/authStore';
import { useTournamentStore } from '../store/tournamentStore';
import { GAMES_LIST } from '../lib/constants';
import type { TournamentFormat, GamePlatform, Region } from '../types';
import type { CreateTournamentInput } from '../services/tournaments';

type Step = 'details' | 'format' | 'rules' | 'schedule' | 'preview';

const steps: { key: Step; label: string }[] = [
  { key: 'details', label: 'Details' },
  { key: 'format', label: 'Format' },
  { key: 'rules', label: 'Rules' },
  { key: 'schedule', label: 'Schedule' },
  { key: 'preview', label: 'Preview' },
];

const defaultFormData: CreateTournamentInput = {
  name: '',
  game: '',
  description: '',
  format: 'single-elimination',
  platform: 'pc',
  region: 'north-america',
  max_participants: 16,
  prize_pool: '',
  rules: '',
  start_date: '',
  registration_deadline: '',
};

export function CreateTournamentPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { createTournament } = useTournamentStore();
  
  const [currentStep, setCurrentStep] = useState<Step>('details');
  const [formData, setFormData] = useState<CreateTournamentInput>(defaultFormData);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof CreateTournamentInput, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentStepIndex = steps.findIndex((s) => s.key === currentStep);

  const updateField = <K extends keyof CreateTournamentInput>(
    field: K,
    value: CreateTournamentInput[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateStep = (): boolean => {
    const newErrors: Partial<Record<keyof CreateTournamentInput, string>> = {};

    if (currentStep === 'details') {
      if (!formData.name.trim()) newErrors.name = 'Tournament name is required';
      if (!formData.game) newErrors.game = 'Please select a game';
      if (!formData.description.trim()) newErrors.description = 'Description is required';
    }

    if (currentStep === 'schedule') {
      if (!formData.start_date) newErrors.start_date = 'Start date is required';
      if (!formData.registration_deadline) newErrors.registration_deadline = 'Registration deadline is required';
      
      if (formData.start_date && formData.registration_deadline) {
        if (new Date(formData.registration_deadline) >= new Date(formData.start_date)) {
          newErrors.registration_deadline = 'Registration must close before tournament starts';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].key);
    }
  };

  const handlePrevious = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].key);
    }
  };

  const handleSubmit = async () => {
    if (!user || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const tournament = await createTournament(formData, user.id);
      navigate(`/tournament/${tournament.id}`);
    } catch (error) {
      console.error('Failed to create tournament:', error);
      setIsSubmitting(false);
    }
  };

  const gameOptions = [
    { value: '', label: 'Select a game' },
    ...GAMES_LIST.map((game) => ({ value: game, label: game })),
  ];

  const formatOptions: { value: TournamentFormat; label: string }[] = [
    { value: 'single-elimination', label: 'Single Elimination' },
    { value: 'double-elimination', label: 'Double Elimination' },
    { value: 'round-robin', label: 'Round Robin' },
  ];

  const platformOptions: { value: GamePlatform; label: string }[] = [
    { value: 'pc', label: 'PC' },
    { value: 'playstation', label: 'PlayStation' },
    { value: 'xbox', label: 'Xbox' },
    { value: 'nintendo', label: 'Nintendo' },
    { value: 'mobile', label: 'Mobile' },
    { value: 'cross-platform', label: 'Cross-Platform' },
  ];

  const regionOptions: { value: Region; label: string }[] = [
    { value: 'north-america', label: 'North America' },
    { value: 'europe', label: 'Europe' },
    { value: 'asia', label: 'Asia' },
    { value: 'oceania', label: 'Oceania' },
    { value: 'south-america', label: 'South America' },
    { value: 'global', label: 'Global' },
  ];

  const participantOptions = [8, 16, 32, 64, 128].map((n) => ({
    value: String(n),
    label: `${n} Participants`,
  }));

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-lg py-lg">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Create Tournament' },
          ]}
        />

        <h1 className="text-h2 uppercase mb-xl">Create Tournament</h1>

        {/* Step Indicator */}
        <div className="flex items-center mb-2xl">
          {steps.map((step, index) => (
            <div key={step.key} className="flex items-center flex-1">
              <div className="flex items-center">
                <div
                  className={`
                    w-8 h-8 flex items-center justify-center text-xs font-medium
                    ${index < currentStepIndex
                      ? 'bg-primary-black text-primary-white'
                      : index === currentStepIndex
                      ? 'bg-primary-black text-primary-white'
                      : 'bg-neutral-200 text-neutral-500'
                    }
                  `}
                >
                  {index < currentStepIndex ? <Check size={16} /> : index + 1}
                </div>
                <span
                  className={`
                    ml-2 text-xs uppercase tracking-wide hidden sm:block
                    ${index <= currentStepIndex ? 'text-primary-black' : 'text-neutral-400'}
                  `}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`
                    flex-1 h-px mx-4
                    ${index < currentStepIndex ? 'bg-primary-black' : 'bg-neutral-200'}
                  `}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="mb-xl">
          {currentStep === 'details' && (
            <div className="space-y-lg">
              <Input
                label="Tournament Name"
                placeholder="Enter tournament name"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                error={errors.name}
              />
              <Select
                label="Game"
                options={gameOptions}
                value={formData.game}
                onChange={(e) => updateField('game', e.target.value)}
                error={errors.game}
              />
              <Textarea
                label="Description"
                placeholder="Describe your tournament..."
                rows={4}
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                error={errors.description}
              />
              <Input
                label="Prize Pool (Optional)"
                placeholder="e.g., $1,000"
                value={formData.prize_pool || ''}
                onChange={(e) => updateField('prize_pool', e.target.value)}
              />
            </div>
          )}

          {currentStep === 'format' && (
            <div className="space-y-lg">
              <Select
                label="Tournament Format"
                options={formatOptions}
                value={formData.format}
                onChange={(e) => updateField('format', e.target.value as TournamentFormat)}
              />
              <Select
                label="Platform"
                options={platformOptions}
                value={formData.platform}
                onChange={(e) => updateField('platform', e.target.value as GamePlatform)}
              />
              <Select
                label="Region"
                options={regionOptions}
                value={formData.region}
                onChange={(e) => updateField('region', e.target.value as Region)}
              />
              <Select
                label="Maximum Participants"
                options={participantOptions}
                value={String(formData.max_participants)}
                onChange={(e) => updateField('max_participants', Number(e.target.value))}
              />
            </div>
          )}

          {currentStep === 'rules' && (
            <div className="space-y-lg">
              <Textarea
                label="Tournament Rules"
                placeholder="Enter the rules and guidelines for your tournament..."
                rows={10}
                value={formData.rules}
                onChange={(e) => updateField('rules', e.target.value)}
              />
              <p className="text-xs text-neutral-500">
                Be clear and specific about match formats, scoring, conduct expectations, and any restrictions.
              </p>
            </div>
          )}

          {currentStep === 'schedule' && (
            <div className="space-y-lg">
              <Input
                label="Registration Deadline"
                type="datetime-local"
                value={formData.registration_deadline}
                onChange={(e) => updateField('registration_deadline', e.target.value)}
                error={errors?.registration_deadline}
              />
              <Input
                label="Tournament Start Date"
                type="datetime-local"
                value={formData.start_date}
                onChange={(e) => updateField('start_date', e.target.value)}
                error={errors?.start_date}
              />
            </div>
          )}

          {currentStep === 'preview' && (
            <div className="border border-neutral-200 p-lg">
              <div className="flex items-start justify-between mb-lg">
                <div>
                  <span className="text-xs text-neutral-500 uppercase tracking-wide">
                    {formData.game}
                  </span>
                  <h2 className="text-h3 uppercase mt-1">{formData.name || 'Untitled Tournament'}</h2>
                </div>
                <StatusBadge status="upcoming" />
              </div>
              
              <p className="text-sm text-neutral-600 mb-lg">
                {formData.description || 'No description provided.'}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-md mb-lg">
                <div>
                  <span className="text-xs text-neutral-500 uppercase tracking-wide block mb-1">Format</span>
                  <span className="text-sm capitalize">{formData.format.replace('-', ' ')}</span>
                </div>
                <div>
                  <span className="text-xs text-neutral-500 uppercase tracking-wide block mb-1">Platform</span>
                  <span className="text-sm capitalize">{formData.platform.replace('-', ' ')}</span>
                </div>
                <div>
                  <span className="text-xs text-neutral-500 uppercase tracking-wide block mb-1">Region</span>
                  <span className="text-sm capitalize">{formData.region.replace('-', ' ')}</span>
                </div>
                <div>
                  <span className="text-xs text-neutral-500 uppercase tracking-wide block mb-1">Max Players</span>
                  <span className="text-sm">{formData.max_participants}</span>
                </div>
              </div>

              {formData.prize_pool && (
                <div className="mb-lg">
                  <span className="text-xs text-neutral-500 uppercase tracking-wide block mb-1">Prize Pool</span>
                  <span className="text-lg font-medium">{formData.prize_pool}</span>
                </div>
              )}

              {formData.rules && (
                <div>
                  <span className="text-xs text-neutral-500 uppercase tracking-wide block mb-2">Rules</span>
                  <div className="bg-neutral-100 p-md text-sm whitespace-pre-wrap">
                    {formData.rules}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-lg border-t border-neutral-200">
          <Button
            variant="secondary"
            onClick={handlePrevious}
            disabled={currentStepIndex === 0}
          >
            <ChevronLeft size={16} />
            Previous
          </Button>

          <div className="flex gap-md">
            {currentStep !== 'preview' && (
              <Button
                variant="text"
                onClick={() => setShowPreviewModal(true)}
              >
                <Eye size={16} />
                Preview
              </Button>
            )}
            
            {currentStep === 'preview' ? (
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Publishing...' : 'Publish Tournament'}
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Next
                <ChevronRight size={16} />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <Modal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        title="Tournament Preview"
        size="lg"
      >
        <div className="space-y-md">
          <div>
            <span className="text-xs text-neutral-500 uppercase tracking-wide">
              {formData.game || 'No game selected'}
            </span>
            <h2 className="text-h3 uppercase mt-1">{formData.name || 'Untitled Tournament'}</h2>
          </div>
          <p className="text-sm text-neutral-600">
            {formData.description || 'No description provided.'}
          </p>
          <div className="grid grid-cols-2 gap-md text-sm">
            <div>
              <span className="text-neutral-500">Format:</span>{' '}
              <span className="capitalize">{formData.format.replace('-', ' ')}</span>
            </div>
            <div>
              <span className="text-neutral-500">Platform:</span>{' '}
              <span className="capitalize">{formData.platform.replace('-', ' ')}</span>
            </div>
            <div>
              <span className="text-neutral-500">Region:</span>{' '}
              <span className="capitalize">{formData.region.replace('-', ' ')}</span>
            </div>
            <div>
              <span className="text-neutral-500">Max Players:</span>{' '}
              {formData.max_participants}
            </div>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}

