;; To re-load the .emacs file while in emacs, do the following:
;;     M-x + x load-file [enter]
;;     ~/.emacs [enter]
;;
;; M-x is ESC x

;; For emacs (version 22.x and later) to find the _emacs file,
;; the HOME environment variable must be set.
;;
;; Place this as a comment in the _emacs file so I'll remember.
;; -------------------------------------------------------------------
;; When doing query/replace and want to replace with an actual newline:
;;   M-%  query: \n  replace C-q C-j
;;
;; Tabs:
;;    M-% query: \t  replace C-q [tab key]
;;
;; Do quote the enter key: C-q C-j. There, C-q inserts the next key
;; literally and C-j gives newline.
;;
;; query-replace-regex (example):
;;     I want to replace "$_REQUEST['key']" with "param('key)" and key
;;     will be different:
;;
;;     M-x query-replace-regex
;;         \$_REQUEST\['\([^']+\)'\]
;;         param('\1')
;;
;; ------ This is for my Mountian Lion MacOS ------
;;(add-to-list 'load-path "/opt/local/share/emacs/23.4/site-lisp")

;; Shows whitespace
;; M-x redspace-mode
;; (add-to-list 'load-path "/Users/mdb/local/src/sh/redspace.el")

(when (fboundp 'electric-indent-mode) (electric-indent-mode -1))

;; Load path for HAML support
;; M-x haml-mode
;(add-to-list 'load-path "/Users/mdb/local/src/sh/haml-mode/haml-mode.el")
;(require 'haml-mode)

(custom-set-variables
 ;; custom-set-variables was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 '(case-fold-search t)
 '(column-number-mode t)
 '(current-language-environment "Latin-1")
 '(default-input-method "latin-1-prefix"))
(custom-set-faces
 ;; custom-set-faces was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 '(default ((t (:stipple nil :background "grey11" :foreground "snow" :inverse-video nil :box nil :strike-through nil :overline nil :underline nil :slant normal :weight normal :height 140 :width normal :family "outline-courier new"))))
 '(border ((t (:background "black"))))
 '(cursor ((t (:background "red"))))
 '(goto-line t)
 '(mouse ((t nil))))

;;----------Jason's/Mark's Customizations-----------;;

;;(set-default-font "-adobe-courier-medium-r-normal--12-120-75-75-m-70-iso8859-7")
;;(set-face-attribute 'default nil :height 140)

;;Do not generate backup files by setting make-back-files to nil
(setq make-backup-files nil)

;;Disregard emacs standard start-up message
(setq inhibit-startup-message t)

;;set global-font-lock-mode at startup
;;(global-font-lock-mode)

;; turn off the tool bar
;;(tool-bar-mode -1)

;;display column width in mode-line
(column-number-mode t)

;; some useful keybindings
(global-set-key [f6] 'goto-line)

;;to recognize .t files the same as .cpp files
(setq auto-mode-alist (cons '("\\.t$" . c++-mode) auto-mode-alist))

;;to recognize .cs (C#) files the same as .cpp files
(setq auto-mode-alist (cons '("\\.cs$" . java-mode) auto-mode-alist))

(setq auto-mode-alist (cons '("\\.as$" . c++-mode) auto-mode-alist))

;;to recognize .vb (VB) files the same as .cpp files
(setq auto-mode-alist (cons '("\\.vb$" . c++-mode) auto-mode-alist))

;;recognize .cfm files the same as .html files
(setq auto-mode-alist (cons '("\\.cfm$" . html-mode) auto-mode-alist))

;;recognize .cfc files the same as .html files
(setq auto-mode-alist (cons '("\\.cfc$" . html-mode) auto-mode-alist))

;;recognize .plx as .pl
(setq auto-mode-alist (cons '("\\.plx$" . perl-mode) auto-mode-alist))


;; loads ruby mode when a .rb file is opened.
(autoload 'ruby-mode "ruby-mode" "Major mode for editing ruby scripts." t)
(setq auto-mode-alist  (cons '(".rb$" . ruby-mode) auto-mode-alist))
(setq auto-mode-alist  (cons '(".rabl$" . ruby-mode) auto-mode-alist))
(setq auto-mode-alist  (cons '(".rake$" . ruby-mode) auto-mode-alist))
(setq auto-mode-alist  (cons '(".cap$" . ruby-mode) auto-mode-alist))

;; recognize .php
;;(require 'php-mode)
;;(setq auto-mode-alist (cons '("\\.php$" . c-mode) auto-mode-alist))
;;
(add-to-list 'load-path "/Users/mdb/local/src/php/php-mode-1.5.0")
(autoload 'php-mode "php-mode" "Major mode for editing php code." t)
(add-to-list 'auto-mode-alist '("\\.php$" . php-mode))
(add-to-list 'auto-mode-alist '("\\.inc$" . php-mode))
;;
;; This is new, I downloaded a php-mode.el file which seems to work just fine.
;; ---------------------------------------------------------------------------
;;(add-to-list 'load-path "/Users/mdb/.emacs_files")
;;(require 'php-mode)
;;(setq auto-mode-alist (cons '("\\.php$" . php-mode) auto-mode-alist))
;;(add-to-list 'auto-mode-alist '("\\.inc$" . php-mode))


;; recognize .js
(setq auto-mode-alist (cons '("\\.js$" . js-mode) auto-mode-alist))
(setq auto-mode-alist (cons '("\\.es6$" . js-mode) auto-mode-alist))

;; recognize .ts (typescript)
(setq auto-mode-alist (cons '("\\.ts$" . js-mode) auto-mode-alist))

;; recognize .erb
(setq auto-mode-alist (cons '("\\.erb$" . html-mode) auto-mode-alist))

;; recognize .js.erb
(setq auto-mode-alist (cons '("\\.js.erb$" . js-mode) auto-mode-alist))

;; recognize .cgi as .pl
(setq auto-mode-alist (cons '("\\.cgi$" . perl-mode) auto-mode-alist))

;; recognize .sql as SQL
(setq auto-mode-alist (cons '("\\.sql$" . sql-mode) auto-mode-alist))

;; Load both major and minor modes in one call based on file type 
(add-to-list 'auto-mode-alist '("\\.css$" . css-mode))

