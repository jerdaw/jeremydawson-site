const root = document.documentElement;
const sections = Array.from(document.querySelectorAll("[data-section]"));
const revealables = Array.from(document.querySelectorAll("[data-reveal]"));
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const emailAddress = ["jeremyjdawson", "gmail.com"].join("@");

root.dataset.enhanced = "true";

if (!reduceMotion) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      }
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -10% 0px",
    },
  );

  for (const item of revealables) {
    revealObserver.observe(item);
  }
} else {
  for (const item of revealables) {
    item.classList.add("is-visible");
  }
}

const setActiveSection = () => {
  const viewportMidpoint = window.innerHeight * 0.35;
  let activeSection = sections[0]?.getAttribute("data-section") ?? "top";

  for (const section of sections) {
    const bounds = section.getBoundingClientRect();
    if (bounds.top <= viewportMidpoint && bounds.bottom >= viewportMidpoint) {
      activeSection = section.getAttribute("data-section") ?? activeSection;
    }
  }

  root.dataset.activeSection = activeSection;
};

const onScroll = () => {
  setActiveSection();
};

onScroll();
window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll);

const emailCard = document.querySelector("[data-email-card]");

if (emailCard instanceof HTMLElement) {
  const emailValue = emailCard.querySelector("[data-email-value]");
  const emailDetail = emailCard.querySelector("[data-email-detail]");
  const revealButton = emailCard.querySelector("[data-email-reveal]");
  const emailLink = emailCard.querySelector("[data-email-link]");
  const copyButton = emailCard.querySelector("[data-email-copy]");

  const revealEmail = () => {
    if (!(emailValue instanceof HTMLElement)) return;

    emailValue.textContent = emailAddress;

    if (emailLink instanceof HTMLAnchorElement) {
      emailLink.href = `mailto:${emailAddress}`;
      emailLink.hidden = false;
    }

    if (copyButton instanceof HTMLButtonElement) {
      copyButton.hidden = false;
    }

    if (revealButton instanceof HTMLButtonElement) {
      revealButton.hidden = true;
    }
  };

  if (revealButton instanceof HTMLButtonElement) {
    revealButton.addEventListener("click", revealEmail);
  }

  if (copyButton instanceof HTMLButtonElement) {
    copyButton.addEventListener("click", async () => {
      revealEmail();

      if (!(emailDetail instanceof HTMLElement)) return;

      try {
        await navigator.clipboard.writeText(emailAddress);
        emailDetail.textContent = "Email copied to clipboard.";
      } catch {
        emailDetail.textContent = "Copy failed. Use the mail link or select the address.";
      }
    });
  }
}
