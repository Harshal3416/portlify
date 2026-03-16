// import { Link } from "wouter";
import { Mail } from "lucide-react";

export function FooterComponent() {

  return (
    <footer className="border-t bg-card mt-10">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <a
                href='/'
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-email"
              >
                <Mail className="h-4 w-4" />
                professor3416@gmail.com
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t-2 border-gray-300 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
