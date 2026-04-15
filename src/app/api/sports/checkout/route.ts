import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const plan = searchParams.get("plan");
  const billing = searchParams.get("billing") || "monthly";

  const planInfo = {
    starter: {
      name: "Starter",
      price: billing === "annual" ? 49 * 12 * 0.67 : 49, // 33% discount for annual
      credits: 100,
      features: ["100 credits/month", "3 picks per day", "All sports covered", "Email delivery"]
    },
    pro: {
      name: "Pro", 
      price: billing === "annual" ? 199 * 12 * 0.67 : 199,
      credits: 500,
      features: ["500 credits/month", "Unlimited daily picks", "All sports + props", "SMS + Email delivery", "Line movement alerts", "ROI tracking dashboard"]
    },
    elite: {
      name: "Elite",
      price: billing === "annual" ? 499 * 12 * 0.67 : 499,
      credits: 2000,
      features: ["2,000 credits/month", "Everything in Pro", "1-on-1 strategy calls (monthly)", "Priority Telegram/Discord alerts", "Custom bet sizing recommendations", "Early access to new models"]
    },
    unlimited: {
      name: "Unlimited",
      price: billing === "annual" ? 999 : 1500,
      credits: "unlimited",
      features: ["Unlimited credits", "Everything in Elite", "AI Q&A assistant", "Personal bankroll management", "Arbitrage alerts", "White-label API access", "Dedicated account manager"]
    }
  };

  if (!plan || !planInfo[plan as keyof typeof planInfo]) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const selectedPlan = planInfo[plan as keyof typeof planInfo];

  // For now, return plan info. Later we'll integrate with Stripe
  return NextResponse.json({
    plan: plan,
    billing: billing,
    planInfo: selectedPlan,
    message: "Stripe checkout integration coming soon. Contact jeff@jeff-cline.com to upgrade manually.",
    // In real implementation:
    // checkoutUrl: `https://checkout.stripe.com/pay/...`
  });
}

export async function POST(request: NextRequest) {
  try {
    const { plan, billing = "monthly" } = await request.json();

    // TODO: Create Stripe checkout session
    // const session = await stripe.checkout.sessions.create({
    //   payment_method_types: ['card'],
    //   line_items: [{
    //     price: getPriceId(plan, billing),
    //     quantity: 1,
    //   }],
    //   mode: 'subscription',
    //   success_url: `${process.env.NEXT_PUBLIC_URL}/sports/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    //   cancel_url: `${process.env.NEXT_PUBLIC_URL}/sports/pricing`,
    //   metadata: {
    //     plan: plan,
    //     billing: billing
    //   }
    // });

    return NextResponse.json({
      message: "Stripe integration pending. Contact jeff@jeff-cline.com to upgrade.",
      plan,
      billing
    });

  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}