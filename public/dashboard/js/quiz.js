/* ============================================
   JEFF CLINE - ONBOARDING QUIZ ENGINE
   Captures leads → GoHighLevel funnel
   ============================================ */

const quizState = {
  currentStep: 1,
  totalSteps: 6,
  answers: {},
  multiSelect: { 3: true } // Step 3 allows multi-select
};

function selectQuizOption(element, multi = false) {
  const step = quizState.currentStep;
  const value = element.dataset.value;

  if (multi || quizState.multiSelect[step]) {
    // Multi-select mode
    element.classList.toggle('selected');
    if (!quizState.answers[step]) quizState.answers[step] = [];
    const idx = quizState.answers[step].indexOf(value);
    if (idx > -1) {
      quizState.answers[step].splice(idx, 1);
    } else {
      quizState.answers[step].push(value);
    }
  } else {
    // Single select
    element.parentElement.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');
    quizState.answers[step] = value;

    // Auto-advance after short delay for single-select
    setTimeout(() => nextQuizStep(), 400);
  }
}

function nextQuizStep() {
  const step = quizState.currentStep;

  // Validate current step
  if (step < 6 && !quizState.answers[step]) {
    // Gently shake the options
    const options = document.querySelector(`.quiz-step[data-step="${step}"] .quiz-options`);
    if (options) {
      options.style.animation = 'none';
      options.offsetHeight; // trigger reflow
      options.style.animation = 'shake 0.5s ease';
    }
    return;
  }

  // If on last step, submit
  if (step === quizState.totalSteps) {
    submitQuiz();
    return;
  }

  // Move to next step
  quizState.currentStep++;
  renderQuizStep();
}

function prevQuizStep() {
  if (quizState.currentStep > 1) {
    quizState.currentStep--;
    renderQuizStep();
  }
}

function renderQuizStep() {
  const step = quizState.currentStep;

  // Update steps visibility
  document.querySelectorAll('.quiz-step').forEach(s => s.classList.remove('active'));
  document.querySelector(`.quiz-step[data-step="${step}"]`).classList.add('active');

  // Update progress bar
  document.querySelectorAll('.quiz-progress-step').forEach((bar, i) => {
    bar.classList.remove('active', 'completed');
    if (i + 1 === step) bar.classList.add('active');
    if (i + 1 < step) bar.classList.add('completed');
  });

  // Show/hide prev button
  document.getElementById('quizPrev').style.visibility = step > 1 ? 'visible' : 'hidden';

  // Update next button text
  const nextBtn = document.getElementById('quizNext');
  if (step === quizState.totalSteps) {
    nextBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Get My Growth Strategy';
    nextBtn.classList.remove('btn-primary');
    nextBtn.classList.add('btn-gold');
  } else {
    nextBtn.innerHTML = 'Next <i class="fas fa-arrow-right"></i>';
    nextBtn.classList.remove('btn-gold');
    nextBtn.classList.add('btn-primary');
  }
}

function submitQuiz() {
  // Gather form data from step 6
  const name = document.getElementById('quizName')?.value || '';
  const email = document.getElementById('quizEmail')?.value || '';
  const phone = document.getElementById('quizPhone')?.value || '';
  const website = document.getElementById('quizWebsite')?.value || '';

  if (!name || !email) {
    alert('Please enter your name and email so we can send your growth strategy!');
    return;
  }

  const leadData = {
    name,
    email,
    phone,
    website,
    businessType: quizState.answers[1] || '',
    revenue: quizState.answers[2] || '',
    goals: quizState.answers[3] || [],
    websites: quizState.answers[4] || '',
    budget: quizState.answers[5] || '',
    submittedAt: new Date().toISOString(),
    source: 'jeff-cline-quiz',
    recommendedPlan: getRecommendedPlan()
  };

  console.log('Lead Data for GoHighLevel:', leadData);

  // TODO: POST to GoHighLevel webhook
  // fetch('https://hooks.gohighlevel.com/YOUR_WEBHOOK_ID', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(leadData)
  // });

  // Show success
  const container = document.getElementById('quizContainer');
  container.innerHTML = `
    <div style="text-align:center; padding:40px 0;">
      <div style="font-size:4rem; margin-bottom:20px;">&#127881;</div>
      <h3 style="margin-bottom:12px;">Your Growth Strategy is Being Built!</h3>
      <p style="color:var(--text-secondary); margin-bottom:8px;">Thank you, <strong>${name}</strong>!</p>
      <p style="color:var(--text-secondary); margin-bottom:24px;">
        Based on your answers, we recommend the <strong class="text-gold">${leadData.recommendedPlan}</strong> plan.
        <br>We'll send your custom strategy to <strong>${email}</strong> within 24 hours.
      </p>
      <div style="background:var(--bg-input); border-radius:var(--radius-sm); padding:20px; margin:24px 0; text-align:left;">
        <h5 style="margin-bottom:12px; color:var(--accent-gold);">Your Profile Summary:</h5>
        <p style="font-size:0.9rem; color:var(--text-secondary); line-height:1.8;">
          <strong>Business:</strong> ${formatAnswer(quizState.answers[1])}<br>
          <strong>Revenue:</strong> ${formatAnswer(quizState.answers[2])}<br>
          <strong>Goals:</strong> ${Array.isArray(quizState.answers[3]) ? quizState.answers[3].join(', ') : quizState.answers[3]}<br>
          <strong>Websites:</strong> ${formatAnswer(quizState.answers[4])}<br>
          <strong>Budget:</strong> ${formatAnswer(quizState.answers[5])}
        </p>
      </div>
      <a href="tel:+12234008146" class="btn btn-gold btn-lg" style="margin-top:16px;">
        <i class="fas fa-phone"></i> Can't Wait? Call (223) 400-8146
      </a>
      <p style="margin-top:20px; font-size:0.85rem; color:var(--text-muted);">
        Or <a href="dashboard.html">preview the client dashboard</a>
      </p>
    </div>
  `;
}

function getRecommendedPlan() {
  const budget = quizState.answers[5] || '';
  const websites = quizState.answers[4] || '';
  const goals = quizState.answers[3] || [];

  if (budget === '3000-10000' || budget === '10000+' || websites === '20+' ||
      goals.includes('tv') || goals.includes('custom')) {
    return 'Enterprise ($3,000/mo)';
  }
  if (budget === '1000-3000' || websites === '2-5' || websites === '6-20' ||
      goals.includes('aeo') || goals.includes('paid')) {
    return 'Professional ($750/mo)';
  }
  return 'Starter ($500/mo)';
}

function formatAnswer(val) {
  if (!val) return 'N/A';
  const map = {
    'startup': 'Startup / Side Hustle',
    'smb': 'Small-Medium Business',
    'enterprise': 'Enterprise / Corporation',
    'agency': 'Agency / Consultant',
    'investor': 'Investor / Family Office',
    'pre-revenue': 'Pre-Revenue',
    '0-10k': '$0 - $10K/mo',
    '10k-50k': '$10K - $50K/mo',
    '50k-250k': '$50K - $250K/mo',
    '250k+': '$250K+/mo',
    '1': '1 Website',
    '2-5': '2-5 Websites',
    '6-20': '6-20 Websites',
    '20+': '20+ Websites',
    'under500': 'Under $500/mo',
    '500-1000': '$500 - $1K/mo',
    '1000-3000': '$1K - $3K/mo',
    '3000-10000': '$3K - $10K/mo',
    '10000+': '$10K+/mo'
  };
  return map[val] || val;
}

// Add shake animation
const style = document.createElement('style');
style.textContent = `@keyframes shake { 0%,100% { transform:translateX(0); } 25% { transform:translateX(-8px); } 75% { transform:translateX(8px); } }`;
document.head.appendChild(style);
