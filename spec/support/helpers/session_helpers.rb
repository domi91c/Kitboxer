module Features
  module SessionHelpers
    def sign_up(email, password, confirmation)
      visit new_user_registration_path
      fill_in 'Email', with: email
      fill_in 'Password', with: password
      fill_in 'Confirm password', :with => confirmation
      click_button 'Sign Up'
    end

    def sign_in(email, password)
      visit new_user_session_path
      fill_in 'Email', with: email
      fill_in 'Password', with: password
      click_button 'Sign In'
    end
  end
end
